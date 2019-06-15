const { getEmailStream } = require('./email-template.js');

const data = require('./article-data.js');
const articleInfo = data[0];
const TEXT_TEMPLATE_PATH = 'templates/email.txt';
const emailStream = getEmailStream( TEXT_TEMPLATE_PATH, articleInfo );

let output = '';
emailStream.on( 'data', chunk => {
  output += chunk.contents.toString();
});

emailStream.on( 'end', chunk => {
  console.log( `${output}` );
});

