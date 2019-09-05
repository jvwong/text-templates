const _ = require('lodash');
const fetch = require('node-fetch');
// const mockJson = require('./data/mock-response.json');

const { FACTOID_DOC_APIKEY, FACTOID_DOCUMENT_URL } = require('./config.js');

const toJSON = res => res.json();
const getDocument = article => {
  const data = _.assign( {}, article, { apiKey: FACTOID_DOC_APIKEY } );
  return fetch( FACTOID_DOCUMENT_URL, {
    method: 'post',
    body: JSON.stringify( data ),
    headers: { 'Content-Type': 'application/json' }
  })
  .then( toJSON );
};

module.exports = getDocument;
