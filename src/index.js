import _ from 'lodash';
import csv from 'csvtojson';

import sendMail from './email-transport';
import { msgFactory } from './util/email-util';
import { renderFromTemplate } from './template'

import {
  APP_NAME,
  APP_DOMAIN,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_SIGNATURE,
  TWITTER_ACCOUNT_NAME,
  NCBI_PUBMED_BASE_URL
} from './config';

const TEMPLATE_PATH = 'input/templates/invitation.txt';
const TEMPLATE_DATA_PATH = 'input/data/sample-data.csv';

const DEFAULT_TEMPLATE_DATA = {
  appName: APP_NAME,
  appDomain: APP_DOMAIN,
  emailSenderName: EMAIL_SENDER_NAME,
  emailSenderSignature: EMAIL_SENDER_SIGNATURE,
  twitterAccountName: TWITTER_ACCOUNT_NAME
};

// Paired templates and data

const getTemplateData = async path => {
  const rawTemplateData = await csv().fromFile( path );
  return rawTemplateData.map( element => {
    const articleLink = `${NCBI_PUBMED_BASE_URL}${element.pmid}`;
    return _.defaults( { articleLink }, element, DEFAULT_TEMPLATE_DATA );
  });
};

const getEmailSubject = templateVars => `Connect your findings about ${templateVars.intParticipantSrc}/${templateVars.intParticipantTgt} to related research`;
const getEmailRecipientAddress = templateVars => _.get( templateVars, 'emailRecipientAddress' );

const doInvite = async ( templatePath, templateData ) => {
  for ( const templateVars of templateData ) {
    try {
      const emailText = await renderFromTemplate( templatePath, templateVars );
      const emailSubject = getEmailSubject( templateVars );
      const emailRecipientAddress = getEmailRecipientAddress( templateVars );
      const mailOpts = msgFactory({ emailRecipientAddress, emailSubject, emailText });
      let info =  await sendMail( mailOpts );
      // console.log( info );
    } catch ( error ) {
      console.error( `Error sending email: ${error.message}`);
      throw error;
    }
  }
}

// Fire it up
Promise.resolve( TEMPLATE_DATA_PATH )
  .then( getTemplateData )
  .then( templateData =>  doInvite( TEMPLATE_PATH, templateData ) )
  .catch( e => {
    console.error(e);
  });
