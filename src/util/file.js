import fs from 'fs';
import Promise from 'bluebird';
import clipboardy from 'clipboardy';
import { Parser } from 'json2csv';

const writeFile = Promise.promisify( fs.writeFile );

const json2csv = jsonData =>  {
  try {
  const parser = new Parser();
  const csv = parser.parse( jsonData );
  return csv;
  } catch (err) {
    console.error(err);
  }
};

const writeToFile = async ( filePath, data ) => {
  try {
    await writeFile( filePath, data );
    return data;
  } catch (err) {
    console.error(err);
  }
};

const copyToClipboard = async data => {
  await clipboardy.write(data);
  return data;
};

export {
  json2csv,
  writeToFile,
  copyToClipboard
};