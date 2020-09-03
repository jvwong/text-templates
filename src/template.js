import _ from 'lodash';
import csv from 'csvtojson';
import fs from 'fs';
import Promise from 'bluebird';
import clipboardy from 'clipboardy';
import { Parser } from 'json2csv';

const writeFile = Promise.promisify( fs.writeFile );
const readFile = Promise.promisify( fs.readFile );
const Hogan = require('hogan.js');

const getTemplate = async templatePath => readFile( templatePath, 'utf8' );
const compileTemplate = template => Hogan.compile( template );

const renderFromTemplate = async ( templatePath, templateData ) => {
  const template = await getTemplate( templatePath )
  const compilation = compileTemplate( template );
  const rendering = compilation.render( templateData );
  return rendering;
};

import {
  APP_NAME,
  APP_DOMAIN,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_SIGNATURE,
  TWITTER_ACCOUNT_NAME
} from './config';
import { eSummary } from './util/eutils';

const TEMPLATE_PATH = 'input/templates/invitation.txt';
const TEMPLATE_DATA_PATH = 'input/data/sample-data.csv';
const DATA_OUTPUT_PATH = 'output/rendered-data.csv';

const DEFAULT_TEMPLATE_DATA = {
  appName: APP_NAME,
  appDomain: APP_DOMAIN,
  emailSenderName: EMAIL_SENDER_NAME,
  emailSenderSignature: EMAIL_SENDER_SIGNATURE,
  twitterAccountName: TWITTER_ACCOUNT_NAME
};

const getTemplateData = async path => {
  const templateData = await csv().fromFile( path );
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

const getEmailSubject = templateVars => `Connect your findings about ${templateVars.intParticipantSrc}/${templateVars.intParticipantTgt} to related research`;
const getEmailRecipientAddress = templateVars => _.get( templateVars, 'emailRecipientAddress' );

const populateTemplates = async ( templatePath, templateData ) => {
  const populated = [];
  for ( const templateVars of templateData ) {
    try {
      const emailText = await renderFromTemplate( templatePath, templateVars );
      const emailSubject = getEmailSubject( templateVars );
      const emailRecipientAddress = getEmailRecipientAddress( templateVars );
      populated.push({ emailRecipientAddress, emailSubject, emailText });
    } catch ( error ) {
      console.error( `Error sending email: ${error.message}`);
      throw error;
    }
  }
  return populated;
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

const copyToClipboard = async data => {
  await clipboardy.write(data);
  return data;
};

const main = async () => {

  try {
    const templateData = await getTemplateData( TEMPLATE_DATA_PATH )
    const populatedTemplates = await populateTemplates( TEMPLATE_PATH, templateData );
    const csvData = json2csv( populatedTemplates );
    await Promise.all([ writeToFile( csvData ), copyToClipboard( csvData ) ]);
    process.exit( 0 );
  } catch ( err ) {
    console.error( err );
    process.exit( 1 );
  }
}

main();

