const { getEmailStream } = require('./email-template.js');

const data = require('./article-data.js');
const articleInfo = data[0];
const emailStream = getEmailStream( articleInfo );

let output = '';
emailStream.on( 'data', chunk => {
  output += chunk.contents.toString();
});

emailStream.on( 'end', chunk => {
  console.log( `email: ${output}` );
});

