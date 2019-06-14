const _ = require('lodash');
const { src, dest, series } = require('gulp');
const template = require('gulp-template');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
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

const getDocs = function(){ 
  const data = require('./article-data.js');
  const submitByDate = getSubmitByDate( DAYS_TO_SUBMIT );
  return data.map( o => _.assign( {}, JOURNAL_DATA, APP_DATA, o, { 
        submitByDate,
        documentUrl: APP_BASE_URL + APP_DOCUMENT_PATH + '/' + o.docSecret + '/' + o.docId
      }) 
    ); 
}

const cleanTask = function( ) {
  return src( 'output/**/*.*' )
    .pipe( clean( { read: false } ) );
};

const compileTemplatesTask = function( ) {

  const docs = getDocs();
  const promises = docs.map( ( d, i ) => {
    return src( 'templates/email.txt' )
      .pipe( template( d ) )
      .pipe( rename( path => {
          path.basename += ( "-" + _.tail( d.contributorName.toLowerCase().split(' ') ) );
        })
      )
      .pipe( dest( 'output' ) );
  });
  return Promise.all( promises );
};

exports.clean = cleanTask;
exports.default = series( cleanTask, compileTemplatesTask ); 