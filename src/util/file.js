import _ from 'lodash';
import fs from 'fs';
import Promise from 'bluebird';
import csv from 'csvtojson';
import { Parser } from 'json2csv';
import { eSummary } from './eutils';
import {
  APP_NAME,
  APP_DOMAIN,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_SIGNATURE,
  TWITTER_ACCOUNT_NAME,
} from '../config';

const writeFile = Promise.promisify( fs.writeFile );

const json2csv = jsonData =>  {
  try {
  const parser = new Parser();
  const csv = parser.parse( jsonData );
  return csv;
  } catch (err) {
    console.error(err);
  }
};

const writeToFile = async ( filePath, data ) => {
  try {
    await writeFile( filePath, data );
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getTemplateData = async path => {
  const templateData = await csv({ delimiter: 'auto' }).fromFile( path );
  const getPmid = d => _.get( d, ['pmid'] );
  const id = templateData.map( getPmid ).join(',');
  const eSummaryResponse = await eSummary( { id } );
  const DEFAULT_TEMPLATE_DATA = {
    appName: APP_NAME,
    appDomain: APP_DOMAIN,
    emailSenderName: EMAIL_SENDER_NAME,
    emailSenderSignature: EMAIL_SENDER_SIGNATURE,
    twitterAccountName: TWITTER_ACCOUNT_NAME
  };

  return templateData.map( currentData => {
    const { pmid } = currentData;
    const { source, pubdate } = _.get( eSummaryResponse, [ 'result', pmid ] );
    const articleCitation = `${source}, ${pubdate}`;
    return _.defaults( { articleCitation }, currentData, DEFAULT_TEMPLATE_DATA );
  });
};

export {
  json2csv,
  writeToFile,
  getTemplateData
};