import path from 'path';
import { json2csv, writeToFile } from './util/file';
import { getTemplateData } from './util/template';
import { TEMPLATE_DATA_FILENAME } from './config';

const TEMPLATE_DATA_PATH = path.resolve( path.join( 'input/data', TEMPLATE_DATA_FILENAME ) );
const PARSED_TEMPLATE_DATA_PATH = path.parse( TEMPLATE_DATA_PATH );
const DATA_OUTPUT_PATH = `output/${PARSED_TEMPLATE_DATA_PATH.name}-processed${PARSED_TEMPLATE_DATA_PATH.ext}`;

const main = async () => {

  try {
    const templateData = await getTemplateData( TEMPLATE_DATA_PATH );
    const csvData = json2csv( templateData );
    await writeToFile( DATA_OUTPUT_PATH, csvData );
    process.exit( 0 );
  } catch ( err ) {
    console.error( err );
    process.exit( 1 );
  }
};

main();

