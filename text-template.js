const _ = require('lodash');
const fs = require('fs');
const Hogan = require('hogan.js');
const moment = require('moment');

const DAYS_TO_SUBMIT = 14;
const APP_BASE_URL = 'https://factoid.baderlab.org';

const getTemplate = templatePath => fs.readFileSync( templatePath, 'utf8' );
const compileTemplate = template => Hogan.compile( template );

const getSubmitByDate = function( days ){ 
  const day = new Date();
  const submitByDay = day.setDate( day.getDate() + days );
  return moment( submitByDay ).format( 'LL' ); 
}

const buildRenderData = docData => {
  const additionalFields = {
    contributorLastName: _.last( _.get( docData, ['contributorName'], '' ).split(' ') ),
    firstAuthorName: _.first( _.get( docData, ['authors'], '' ).split(',') ),
    submitByDate: getSubmitByDate( DAYS_TO_SUBMIT ),
    docUrl: APP_BASE_URL + _.get( docData, ['privateUrl'], '' ) + '/' + _.get( docData, ['secret'], '' )
  };
  return _.assign( {},
    docData,
    additionalFields
  ) 
};

const renderFromTemplate = ( templatePath, docData ) => {
  const renderData = buildRenderData( docData );
  return Promise.resolve( templatePath )
    .then( getTemplate )
    .then( compileTemplate )
    .then( compiled => compiled.render( renderData ) );  
};


module.exports = {
  renderFromTemplate
};