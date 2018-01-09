import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import DualPane from 'src/components/common/DualPane';
import TextViewer from './viewers/TextViewer';
import HtmlViewer from './viewers/HtmlViewer';
import PdfViewer from './viewers/PdfViewer';
import ExcelViewer from './viewers/TabularViewer';
import ImageViewer from './viewers/ImageViewer';
import FolderViewer from './viewers/FolderViewer';
import EmailHeadersViewer from './viewers/EmailHeadersViewer';

class DocumentContent extends Component {
  render() {
    const { document, fragId } = this.props;
    // console.log(document.schemata);

    return (
      <DualPane.ContentPane>
        {document.status === 'fail' && (
          <div className="pt-callout pt-intent-warning">
            <h5>
              <FormattedMessage id="document.status_fail"
                                defaultMessage="This document was not imported successfully"/>
            </h5>
            { document.error_message }
          </div>
        )}

        {document.schema === 'Email' && (
          <EmailHeadersViewer headers={document.headers} />
        )}

        {document.text && !document.html && (
          <TextViewer text={document.text} />
        )}

        {document.html && (
          <HtmlViewer html={document.html} />
        )}

        {document.links && document.links.pdf && (
          <PdfViewer
            url={document.links.pdf}
            fragId={fragId}
          />
        )}

        {document.schema === 'Image' && (
          <ImageViewer document={document} />
        )}

        {document.children !== undefined && document.children > 0 && (
          <FolderViewer document={document} />
        )}

          {document.extension === 'csv' &&
          <ExcelViewer documentId={document.id}/>}

      </DualPane.ContentPane>
    );
  }
}

export default DocumentContent;
