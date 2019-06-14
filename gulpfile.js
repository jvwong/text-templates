const { src, dest, series } = require('gulp');


const clean = function( cb ) {
  // body omitted
  cb();
};


const createEmailTask = function() {
  // place code for your default task here
  return src( 'templates/email.txt' )
    .pipe( dest( 'output' ) );
}

exports.default = series( clean, createEmailTask ); 