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

export const APP_NAME = env( 'APP_NAME', 'Biofactoid' );
export const APP_DOMAIN = env( 'APP_DOMAIN', 'biofactoid.org' );

// Links
export const NCBI_PUBMED_BASE_URL = env('PUBMED_LINK_BASE_URL', 'https://pubmed.ncbi.nlm.nih.gov/');

// Services
export const NCBI_EUTILS_BASE_URL = env('NCBI_EUTILS_BASE_URL', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/');
export const NCBI_EUTILS_API_KEY = env('NCBI_EUTILS_API_KEY', 'b99e10ebe0f90d815a7a99f18403aab08008');

// Email
export const EMAIL_ENABLED = env('EMAIL_ENABLED', false);
export const EMAIL_FROM_ADDR = env('EMAIL_FROM_ADDR', 'jeffvin.wong@utoronto.ca');
export const EMAIL_FROM = env('EMAIL_FROM', 'Jeffrey V Wong');
export const EMAIL_SENDER_NAME = env('EMAIL_SENDER_NAME', 'Jeff');
export const EMAIL_SENDER_SIGNATURE = env('EMAIL_SENDER_SIGNATURE', 'Jeffrey V. Wong | baderlab.org | University of Toronto');
export const SMTP_PORT = env('SMTP_PORT', 587);
export const SMTP_HOST = env('SMTP_HOST', 'localhost');
export const SMTP_USER = env('SMTP_USER', 'user');
export const SMTP_PASSWORD = env('SMTP_PASSWORD', 'password');

// Other
export const TWITTER_ACCOUNT_NAME = env('TWITTER_ACCOUNT_NAME', 'biofactoid');
