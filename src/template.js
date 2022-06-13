import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import { json2csv, writeToFile, copyToClipboard } from './util/file';
import { getTemplateData } from './util/template';
import {
  EMAIL_SUBJECT,
  TEMPLATE_FILENAME,
  TEMPLATE_DATA_FILENAME
} from './config';

const readFile = Promise.promisify( fs.readFile );
const Hogan = require('hogan.js');

const getTemplate = async templatePath => readFile( templatePath, 'utf8' );
const compileTemplate = template => Hogan.compile( template );

const renderFromTemplate = async ( templatePath, templateData ) => {
  const template = await getTemplate( templatePath );
  const compilation = compileTemplate( template );
  const rendering = compilation.render( templateData );
  return rendering;
};

const TEMPLATE_PATH = path.resolve( path.join( 'input/templates', TEMPLATE_FILENAME) );
const TEMPLATE_DATA_PATH = path.resolve( path.join( 'input/data', TEMPLATE_DATA_FILENAME ) );
const DATA_OUTPUT_PATH = `output/rendered-data.csv`;

const getEmailSubject = () => EMAIL_SUBJECT;
const getEmailRecipientAddress = templateVars => _.get( templateVars, 'emailRecipientAddress' );

const populateTemplates = async ( templatePath, templateData ) => {
  const populated = [];
  for ( const templateVars of templateData ) {
    try {
      const emailText = await renderFromTemplate( templatePath, templateVars );
      const emailSubject = getEmailSubject( templateVars );
      const emailRecipientAddress = getEmailRecipientAddress( templateVars );
      populated.push({ emailRecipientAddress, emailSubject, emailText });
    } catch ( error ) {
      console.error( `Error sending email: ${error.message}`);
      throw error;
    }
  }
  return populated;
};

const main = async () => {

  try {
    const templateData = await getTemplateData( TEMPLATE_DATA_PATH );
    const populatedTemplates = await populateTemplates( TEMPLATE_PATH, templateData );
    const csvData = json2csv( populatedTemplates );
    await Promise.all([ writeToFile( DATA_OUTPUT_PATH, csvData ), copyToClipboard( csvData ) ]);
    process.exit( 0 );
  } catch ( err ) {
    console.error( err );
    process.exit( 1 );
  }
};

main();

