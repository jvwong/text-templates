const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');

const DAYS_TO_SUBMIT = 14;
const APP_BASE_URL = 'https://factoid.baderlab.org';

const getSubmitByDate = function( days ){
  const day = new Date();
  const submitByDay = day.setDate( day.getDate() + days );
  return moment( submitByDay ).format( 'LL' );
}

const buildRenderData = templateData => {
  const additionalFields = {
    contributorLastName: _.last( _.get( templateData, ['contributorName'], '' ).split(' ') ),
    firstAuthorName: _.first( _.get( templateData, ['authors'], '' ).split(',') ),
    submitByDate: getSubmitByDate( DAYS_TO_SUBMIT ),
    docUrl: APP_BASE_URL + _.get( templateData, ['privateUrl'], '' )
  };
  return _.assign( {},
    templateData,
    additionalFields
  )
};

module.exports = buildRenderData;