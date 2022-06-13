import _ from 'lodash';
import csv from 'csvtojson';
import { eSummary } from './eutils';
import {
  APP_NAME,
  APP_DOMAIN,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_SIGNATURE,
  TWITTER_ACCOUNT_NAME,
} from '../config';

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
  getTemplateData
};