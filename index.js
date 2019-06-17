const path = require('path');

const { createEmail } = require('./email-template.js');

const data = require('./article-data.js');
const articleInfo = data[0];
const templatePath = path.resolve(__dirname, './templates/email.mst' );
const email = createEmail( templatePath, articleInfo );

console.log(email);
