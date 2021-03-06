import logging
from threading import RLock
from ahocorasick import Automaton, EMPTY

from aleph.util import match_form
from aleph.model import Entity
from aleph.analyze.analyzer import Analyzer
from aleph.model import DocumentTag, DocumentTagCollector


log = logging.getLogger(__name__)
lock = RLock()


class AutomatonCache(object):

    TYPES = {
        'Person': DocumentTag.TYPE_PERSON,
        'Organization': DocumentTag.TYPE_ORGANIZATION,
        'Company': DocumentTag.TYPE_ORGANIZATION,
        'LegalEntity': DocumentTag.TYPE_PERSON,
    }

    def __init__(self):
        self.latest = None
        self.automaton = Automaton()
        self.matches = {}

    def generate(self):
        with lock:
            self._generate()

    def _generate(self):
        latest = Entity.latest()
        if latest is None:
            return
        if self.latest is not None and self.latest >= latest:
            return
        self.latest = latest

        matches = {}
        q = Entity.all()
        for entity in q:
            tag = self.TYPES.get(entity.schema)
            if tag is None:
                continue
            for name in entity.names:
                if name is None or len(name) > 120:
                    continue
                match = match_form(name)
                # TODO: this is a weird heuristic, but to avoid overly
                # aggressive matching it may make sense:
                if match is None or ' ' not in match:
                    continue
                if match in matches:
                    matches[match].append((name, tag))
                else:
                    matches[match] = [(name, tag)]

        if not len(matches):
            return

        for term, entities in matches.iteritems():
            self.automaton.add_word(term.encode('utf-8'), entities)
        self.automaton.make_automaton()
        log.info('Generated automaton with %s terms', len(matches))


class AhoCorasickEntityAnalyzer(Analyzer):
    ORIGIN = 'regex'
    MIN_LENGTH = 100

    cache = AutomatonCache()

    def analyze(self, document):
        text = match_form(document.text)
        if text is None or len(text) <= self.MIN_LENGTH:
            return

        collector = DocumentTagCollector(document, self.ORIGIN)
        self.cache.generate()
        if self.cache.automaton.kind != EMPTY:
            text = text.encode('utf-8')
            for match in self.cache.automaton.iter(text):
                for (text, tag) in match[1]:
                    collector.emit(text, tag)

        log.info('Aho Corasick extraced %s entities.', len(collector))
        collector.save()
