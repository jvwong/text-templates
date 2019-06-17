const _ = require('lodash');
const fs = require('fs');
const Hogan = require("hogan.js");
const moment = require('moment');

const DAYS_TO_SUBMIT = 21;
const APP_BASE_URL = 'https://factoid.baderlab.org/';
const APP_DOCUMENT_PATH = 'document';

const JOURNAL_DATA = { 
  journalName: 'Molecular Cell'
};

const APP_DATA = {
  appUrl: APP_BASE_URL,
  appName: 'Factoid'
};

const getSubmitByDate = function( days ){ 
  const day = new Date();
  const submitByDay = day.setDate( day.getDate() + days );
  return moment( submitByDay ).format( 'LL' ); 
}

const getDocData = articleInfo => {   
  const submitByDate = getSubmitByDate( DAYS_TO_SUBMIT );
  return _.assign( {}, JOURNAL_DATA, APP_DATA, articleInfo, { 
        submitByDate,
        documentUrl: APP_BASE_URL + APP_DOCUMENT_PATH + '/' + articleInfo.docSecret + '/' + articleInfo.docId
      }) 
};

const renderFromTemplate = ( templatePath, articleInfo ) => {
  const template = fs.readFileSync( templatePath, 'utf8' );  
  const cTemplate = Hogan.compile( template );
  const docData = getDocData( articleInfo );
  const rendered = cTemplate.render( docData );
  return rendered;
};


module.exports = {
  renderFromTemplate
};