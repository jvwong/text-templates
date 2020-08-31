const fs = require('fs');
const Hogan = require('hogan.js');
const Promise = require('bluebird');
const readFile = Promise.promisify( fs.readFile );

const getTemplate = async templatePath => readFile( templatePath, 'utf8' );
const compileTemplate = template => Hogan.compile( template );

const renderFromTemplate = async ( templatePath, templateData ) => {
  const template = await getTemplate( templatePath )
  const compilation = compileTemplate( template );
  const rendering = compilation.render( templateData );
  return rendering;
};

export { renderFromTemplate };