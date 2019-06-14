const { src, dest, series } = require('gulp');
const template = require('gulp-template');
const clean = require('gulp-clean');

const APP_BASE_URL = 'https://factoid.baderlab.org/';
const APP_DOCUMENT_PATH = 'document';

const ARTICLE_DATA = [
  { 
    journalName: 'Molecular Cell', 
    title: 'Acetylation of PHF5A Modulates Stress Responses and Colorectal Carcinogenesis through Alternative Splicing-Mediated Upregulation of KDM3A', 
    firstAuthor: 'Zhe Wang', 
    trackingId: 'https://doi.org/10.1016/j.molcel.2019.04.009', 
    contributorName: 'Jianyuan Luo', 
    contributorEmail: 'luojianyuan@bjmu.edu.cn', 
    contributorAddress: 'Department of Medical Genetics, Center for Medical Genetics\nPeking University Health Science Center, Beijing 100191, China',
    documentUrl: APP_BASE_URL + APP_DOCUMENT_PATH + '/88de82c6-3181-4833-9f4e-b801b9e2f0db/726971cc-d47d-4f9f-b55a-78c88c1c733b',
    submitByDate: 'July 27, 2019',
    appUrl: APP_BASE_URL,
    appName: 'Mentena'
  }
];

const cleanTask = function( cb ) {
  return src( 'output/**/*.*' )
    .pipe( clean( { read: false } ) );
};

const compileTemplatesTask = function( ) {
  return src( 'templates/email.txt' )
    .pipe( template( ARTICLE_DATA[0] ))
    .pipe( dest( 'output' ) );
};



exports.clean = cleanTask;
exports.default = series( cleanTask, compileTemplatesTask ); 