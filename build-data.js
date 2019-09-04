const _ = require('lodash');
const moment = require('moment');

const { DAYS_TO_SUBMIT_DOCUMENT } = require('./config.js')
const { APP_BASE_URL } = require('./config.js')

const getSubmitByDate = function( days ){
  const day = new Date();
  const submitByDay = day.setDate( day.getDate() + days );
  return moment( submitByDay ).format( 'LL' );
}

const buildRenderData = templateData => {
  const additionalFields = {
    contributorLastName: _.last( _.get( templateData, ['contributorName'], '' ).split(' ') ),
    firstAuthorName: _.first( _.get( templateData, ['authors'], '' ).split(',') ),
    submitByDate: getSubmitByDate( DAYS_TO_SUBMIT_DOCUMENT ),
    docUrl: APP_BASE_URL + _.get( templateData, ['privateUrl'], '' )
  };
  return _.assign( {},
    templateData,
    additionalFields
  )
};

module.exports = buildRenderData;