const path = require('path');

const { renderFromTemplate } = require('./email-template.js');

const data = require('./article-data.js');
const articleInfo = data[0];
const templatePath = path.resolve(__dirname, './templates/email.txt' );
const email = renderFromTemplate( templatePath, articleInfo );

console.log(email);
