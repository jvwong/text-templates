const path = require('path');

const { renderFromTemplate } = require('./text-template.js');
const { getDocData } = require('./data/doc-data.js');

const docData = getDocData( '88de82c6-3181-4833-9f4e-b801b9e2f0db' );
const templatePath = path.resolve( __dirname, './templates/email.txt' );

renderFromTemplate( templatePath, docData )
  .then( out => console.log( out ) )
  ;
