import React, { Component } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tab2, Tabs2, Tooltip, Position } from "@blueprintjs/core";
import sumBy from 'lodash/sumBy';

import Schema from 'src/components/common/Schema';

import './SearchFilterSchema.css';

class SearchFilterSchema extends Component {
  constructor(props)  {
    super(props);
    this.ALL = 'ALL';
    this.tabChange = this.tabChange.bind(this);
  }

  tabChange(tabId) {
    const { updateQuery, query } = this.props;
    if (tabId === this.ALL) {
      updateQuery(query.setFilter('schema', []));
    } else {
      updateQuery(query.setFilter('schema', tabId));
    }
  }

  render() {
    const { result, query } = this.props;
    const current = query.getFilter('schema') + '' || this.ALL;
    const values = (result && !result.isFetching) ? result.facets.schema.values : [];
  
    return (
      <div className="SearchFilterSchema">
        <Tabs2 onChange={this.tabChange} selectedTabId={current}>
          <Tab2 id={this.ALL}>
            <FormattedMessage id="search.schema.all" defaultMessage="All"/>{' '}
            <FormattedNumber value={sumBy(values, 'count')} />
          </Tab2>
          { values.map((schema) => (
            <Tab2 key={schema.id} id={schema.id}>
              <Tooltip content={schema.label} position={Position.BOTTOM}>
                <span>
                  <Schema.Icon schema={schema.id} />{' '}
                  <FormattedMessage id={schema.label} defaultMessage={schema.label}/>{' '}
                  <FormattedNumber value={schema.count} />
                </span>
              </Tooltip>
            </Tab2>
          ))}
        </Tabs2>
      </div> 
    )
  }
}

export default SearchFilterSchema;
