const path = require('path');
const _ = require('lodash');

const { renderFromTemplate } = require('./text-template.js');
const { buildRenderData } = require('./build-data.js');
const { documents, emailData } = require('./data/email-data.js');
const findById = ( docs, id ) => _.find( docs, { 'id': id } );

documents.forEach( ( document, i ) => {
  const rawData = _.assign( {}, document, findById( emailData, document.id ) );
  const renderData = buildRenderData( rawData );
  const templatePath = path.resolve( __dirname, './templates/invitation-follow-up.txt' );
  
  renderFromTemplate( templatePath, renderData )
    .then( out => {
      i ?  console.log( '\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n' ): '';
      console.log( out )
    });
});
