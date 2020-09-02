import _ from 'lodash';
import csv from 'csvtojson';
import fs from 'fs';
import Promise from 'bluebird';
import clipboardy from 'clipboardy';

const writeFile = Promise.promisify( fs.writeFile );

// import sendMail from './email-transport';
// import { msgFactory } from './util/email-util';
import { Parser } from 'json2csv';
import { renderFromTemplate } from './template'

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

// Paired templates and data

const getTemplateData = async path => {
  let output = [];
  const templateData = await csv().fromFile( path );
  for ( const currentData of templateData ){
    const { pmid } = currentData;
    const eSummaryResponse = await eSummary({ id: currentData.pmid });
    const { source, pubdate } = _.get( eSummaryResponse, [ 'result', pmid ] );
    const articleCitation = `${source}, ${pubdate}`;
    output.push( _.defaults( { articleCitation }, currentData, DEFAULT_TEMPLATE_DATA ) );
  }
  return output;
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
      // const mailOpts = msgFactory({ emailRecipientAddress, emailSubject, emailText });
      // let info =  await sendMail( mailOpts );
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

  console.log(data);

  return data;
};

// Fire it up
Promise.resolve( TEMPLATE_DATA_PATH )
  .then( getTemplateData )
  .then( templateData =>  populateTemplates( TEMPLATE_PATH, templateData ) )
  .then( json2csv )
  .then( writeToFile )
  .then( copyToClipboard )
  .catch( e => {
    console.error(e);
  });
