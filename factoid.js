const fetch = require('node-fetch');

const { FACTOID_DOCUMENT_URL } = require('./config.js')
const toJSON = res => res.json();
const getDocument = article => {
  return fetch( FACTOID_DOCUMENT_URL, {
        method: 'post',
        body: JSON.stringify( article ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( toJSON );
};

module.exports = getDocument;
