import { combineReducers } from 'redux'

import collections from './collections'
import metadata from './metadata'
import session from './session'
import entities from './entities';
import tabularResults from './tabularResults';
import statistics from './statistics';

const rootReducer = combineReducers({
  collections,
  metadata,
  session,
  entities,
  tabularResults,
  statistics
});

export default rootReducer;
