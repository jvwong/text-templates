const _ = require('lodash');
const env = (key, defaultVal) => {
  if( process.env[key] != null ){
    let val =  process.env[key];

    if( _.isInteger(defaultVal) ){
      val = parseInt(val);
    }
    else if( _.isBoolean(defaultVal) ){
      val = JSON.parse(val);
    }

    return val;
  } else {
    return defaultVal;
  }
};

const APP_BASE_URL = env( 'APP_BASE_URL', 'https://factoid.baderlab.org' );
const FACTOID_DOCUMENT_URL = env( 'FACTOID_DOCUMENT_URL', 'http://unstable.factoid.baderlab.org/api/document' );
const DAYS_TO_SUBMIT_DOCUMENT = env( 'DAYS_TO_SUBMIT_DOCUMENT', 14 );
const FACTOID_DOC_APIKEY = env( 'FACTOID_DOC_APIKEY', '' );

module.exports = {
  APP_BASE_URL,
  FACTOID_DOCUMENT_URL,
  DAYS_TO_SUBMIT_DOCUMENT,
  FACTOID_DOC_APIKEY
};
