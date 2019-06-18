const _ = require('lodash');
const fs = require('fs');
const Hogan = require('hogan.js');
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

const getRenderData = templateData => {   
  const submitByDate = getSubmitByDate( DAYS_TO_SUBMIT );
  return _.assign( {}, JOURNAL_DATA, APP_DATA, templateData, { 
        submitByDate,
        documentUrl: APP_BASE_URL + APP_DOCUMENT_PATH + '/' + templateData.docSecret + '/' + templateData.docId
      }) 
};

const renderFromTemplate = ( templatePath, templateData ) => {
  const template = fs.readFileSync( templatePath, 'utf8' );  
  const cTemplate = Hogan.compile( template );
  const renderData = getRenderData( templateData );
  const rendered = cTemplate.render( renderData );
  return rendered;
};


module.exports = {
  renderFromTemplate
};