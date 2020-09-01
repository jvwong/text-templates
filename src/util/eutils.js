import _ from 'lodash';
import queryString from 'query-string';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import { NCBI_EUTILS_BASE_URL, NCBI_EUTILS_API_KEY } from '../config';
import { checkHTTPStatus } from './fetch';

const EUTILS_SUMMARY_URL = NCBI_EUTILS_BASE_URL + 'esummary.fcgi';
const DEFAULT_ESUMMARY_PARAMS = {
  db: 'pubmed',
  retmode: 'json',
  retstart: 0,
  retmax: 10000,
  api_key: NCBI_EUTILS_API_KEY
};

/**
 * eSummary
 * Generic wrapper for NCBI ELINK EUTIL
 * @param {Object} opts The options for ELINK service(see [SML Dataguide]{@link https://dataguide.nlm.nih.gov/eutilities/utilities.html#esummary} )
 */
const eSummary = opts => {
  const url = EUTILS_SUMMARY_URL;
  const userAgent = `${process.env.npm_package_name}/${process.env.npm_package_version}`;
  const params = _.defaults( {}, opts, DEFAULT_ESUMMARY_PARAMS );
  const body = new URLSearchParams( queryString.stringify( params ) );
  return fetch( url, {
    method: 'POST',
    headers: {
      'User-Agent': userAgent
    },
    body
  })
  .then( checkHTTPStatus ) // HTTPStatusError
  .then( response => response.json() );
};

export { eSummary };