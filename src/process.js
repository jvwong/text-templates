import _ from 'lodash';
import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import { Parser } from 'json2csv';

const writeFile = Promise.promisify( fs.writeFile );

import {
  APP_NAME,
  APP_DOMAIN,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_SIGNATURE,
  TWITTER_ACCOUNT_NAME,
  TEMPLATE_DATA_FILENAME
} from './config';
import { eSummary } from './util/eutils';

const TEMPLATE_DATA_PATH = path.resolve( path.join( 'input/data', TEMPLATE_DATA_FILENAME ) );
const PARSED_TEMPLATE_DATA_PATH = path.parse( TEMPLATE_DATA_PATH );
const DATA_OUTPUT_PATH = `output/${PARSED_TEMPLATE_DATA_PATH.name}-processed${PARSED_TEMPLATE_DATA_PATH.ext}`;

const DEFAULT_TEMPLATE_DATA = {
  appName: APP_NAME,
  appDomain: APP_DOMAIN,
  emailSenderName: EMAIL_SENDER_NAME,
  emailSenderSignature: EMAIL_SENDER_SIGNATURE,
  twitterAccountName: TWITTER_ACCOUNT_NAME
};

const getTemplateData = async path => {
  const templateData = await csv({ delimiter: 'auto' }).fromFile( path );
  const getPmid = d => _.get( d, ['pmid'] );
  const id = templateData.map( getPmid ).join(',');
  const eSummaryResponse = await eSummary( { id } );

  return templateData.map( currentData => {
    const { pmid } = currentData;
    const { source, pubdate } = _.get( eSummaryResponse, [ 'result', pmid ] );
    const articleCitation = `${source}, ${pubdate}`;
    return _.defaults( { articleCitation }, currentData, DEFAULT_TEMPLATE_DATA );
  });
};

const json2csv = jsonData =>  {
  try {
    const parser = new Parser();
    const csv = parser.parse( jsonData );
    return csv;
  } catch (err) {
    console.error(err);
  }
};

const writeToFile = async data =>  {
  try {
    await writeFile( DATA_OUTPUT_PATH, data );

    return data;
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {

  try {
    const templateData = await getTemplateData( TEMPLATE_DATA_PATH );
    const csvData = json2csv( templateData );
    await Promise.all([ writeToFile( csvData ) ]);
    process.exit( 0 );
  } catch ( err ) {
    console.error( err );
    process.exit( 1 );
  }
}

main();

