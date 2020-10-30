import _ from 'lodash';
import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import fetch from 'node-fetch';
import { Parser } from 'json2csv';

import {
  APP_BASE_URL
} from './config';

const DELAY_MS = 5000;

const writeFile = Promise.promisify( fs.writeFile );
// const readFile = Promise.promisify( fs.readFile );

const DATA_FILENAME = 'curation-tracked.csv'
const DATA_UPDATE_FILENAME = 'curation-tracked-updated.csv'
const DOCUMENT_DATA_PATH = path.resolve( path.join( 'input/data', DATA_FILENAME ) );
const DATA_OUTPUT_PATH = path.resolve( path.join( 'output', DATA_UPDATE_FILENAME ) );

const getDocumentData = async path => {
  const documentData = await csv({ delimiter: 'auto' }).fromFile( path );
  return documentData;
};

const postDoc = async documentDatum => {
  const {
    pmid: paperId,
    curatorEmail: authorEmail
  } = documentDatum;

  const url = `${APP_BASE_URL}api/document`;
  return fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      paperId,
      authorEmail
    })
  })
  .then( res => res.json() )
};

const updateDocumentData = ( documentData, documents ) => {

  return documentData.map( datum => {
    const { pmid, documentURL } = datum;
    const matchingDocument = !documentURL && _.find( documents, d => d.citation.pmid == pmid );
    if( matchingDocument ) _.set( datum, ['documentURL'], `${APP_BASE_URL}${matchingDocument.privateUrl.slice( 1 )}` );
    return datum;
  });
};

const writeToFile = async ( path, data ) =>  {
  try {
    await writeFile( path, data );
    return data;
  } catch (err) {
    console.error(err);
  }
};

const json2csv = jsonData =>  {
  try {
    const parser = new Parser();
    const csv = parser.parse( jsonData );
    return csv;
  } catch ( err ) {
    console.error(err);
  }
};

const sleep = delay => new Promise ( resolve => {
  setTimeout( () => {
    resolve();
  }, delay )
});

const createDocuments = async documentData => {
  // return await Promise.all( documentData.map( postDoc ) );
  const delay = DELAY_MS;
  const newDocs = [];

  for ( const datum of documentData ) {
    const newDoc = await postDoc( datum );
    console.log( `created: ${newDoc.id}` );
    newDocs.push( newDoc );
    await sleep( delay );
  }

  return newDocs;
};

/**
 * main
 *
 * Create documents from information csv, then update csv
 *
 * NB: Email is disabled on master.factoid.baderlab.org
 *
 */
const main = async () => {
  const hasNoUrl = entry => entry.documentURL == '';

  const documentData = await getDocumentData( DOCUMENT_DATA_PATH );
  const noUrlDocData = documentData.filter( hasNoUrl );
  const newDocuments = await createDocuments( noUrlDocData.slice( 0 , 10 ) );

  const updatedDocumentData = updateDocumentData( documentData, newDocuments );
  const csvData = json2csv( updatedDocumentData );
  await writeToFile( DATA_OUTPUT_PATH, csvData );
};

main()