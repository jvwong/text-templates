const path = require('path');

const { renderFromTemplate } = require('./text-template.js');
const { getDocData } = require('./data/doc-data.js');

const docData = getDocData( '7826fd5b-d5af-4f4c-9645-de5264907272' );
const templatePath = path.resolve( __dirname, './templates/email.txt' );

renderFromTemplate( templatePath, docData )
  .then( out => console.log( out ) )
  ;
