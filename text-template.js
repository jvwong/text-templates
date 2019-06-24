const fs = require('fs');
const Hogan = require('hogan.js');

const getTemplate = templatePath => fs.readFileSync( templatePath, 'utf8' );
const compileTemplate = template => Hogan.compile( template );

const renderFromTemplate = ( templatePath, renderData ) => {
  return Promise.resolve( templatePath )
    .then( getTemplate )
    .then( compileTemplate )
    .then( compiled => compiled.render( renderData ) );  
};


module.exports = {
  renderFromTemplate
};