const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const data = require('./data/email-data-p2-extra-input.json');
const buildRenderData = require('./build-data.js');
const renderFromTemplate = require('./text-template.js');
const getDocument = require('./factoid.js');

async function createEmails ( articles, templatePath ) {
  for ( const article of articles ) {
    try {
      const contributorAffiliation = _.pick( article, ['contributorAffiliation'] );
      const document = await getDocument( article );
      const renderData = buildRenderData( _.assign( {}, document, contributorAffiliation ) );
      const text = await renderFromTemplate( path.resolve( __dirname, templatePath ), renderData );

      const outFile = `./emails/${_.get( article, ['trackingId'] )}.txt`;
      fs.writeFileSync( path.resolve( __dirname, outFile ), text );
    } catch (e) {
      console.log( e );
    }
  }
  console.log('Done!');
}

const key = 'b';
const tmplName = `invitation-version-${key}.txt`
createEmails( _.get( data, `${key}` ), './templates/' + tmplName );

