const { src, dest, series } = require('gulp');
const template = require('gulp-template');
const clean = require('gulp-clean');

const FACTOID_BASE_URL = 'https://factoid.baderlab.org/';
const FACTOID_DOCUMENT_PATH = 'document';

const ARTICLE_DATA = [
  { 
    journalName, 
    title, 
    authors, 
    trackingId, 
    contributorName, 
    contributorEmail, 
    editorName, 
    editorEmail
    
    corresponding_author_name: 'Jianyuan Luo',
    corresponding_author_email: 'luojianyuan@bjmu.edu.cn',
    corresponding_author_address: 'Department of Medical Genetics, Center for Medical Genetics\nPeking University Health Science Center, Beijing 100191, China',
    document_url: 'https://factoid.baderlab.org/document/88de82c6-3181-4833-9f4e-b801b9e2f0db/726971cc-d47d-4f9f-b55a-78c88c1c733b' 
  }
];

const cleanTask = function( cb ) {
  return src( 'output/**/*.*' )
    .pipe( clean( { read: false } ) );
};

const compileTemplatesTask = function( ) {
  return src( 'templates/email.html' )
    .pipe( template( ARTICLE_DATA[0] ))
    .pipe( dest( 'output' ) );
};



exports.clean = cleanTask;
exports.default = series( cleanTask, compileTemplatesTask ); 