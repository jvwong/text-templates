const _ = require('lodash');

const documents = [
  { 
    "id": "88de82c6-3181-4833-9f4e-b801b9e2f0db",
    "secret": "read-only",
    "title": "Acetylation of PHF5A Modulates Stress Responses and Colorectal Carcinogenesis through Alternative Splicing-Mediated Upregulation of KDM3A",
    "publicUrl": "/document/88de82c6-3181-4833-9f4e-b801b9e2f0db",
    "privateUrl": "/document/88de82c6-3181-4833-9f4e-b801b9e2f0db",
    "journalName": "Molecular Cell",
    "authors": "Zhe Wang,Xin Yang,Cheng Liu,Xin Li,Buyu Zhang,Bo Wang,Yu Zhang,Chen Song,Tianzhuo Zhang,Minghui Liu,Boya Liu,Mengmeng Ren,Hongpeng Jiang,Junhua Zou,Xiaoyun Liu,Hongquan Zhang,Wei-Guo Zhu,Yuxin Yin,Zhang Zhang,Wei Gu,Jianyuan Luo",
    "trackingId": "https://doi.org/10.1016/j.molcel.2019.04.009",
    "contributorName": "Jianyuan Luo",
    "contributorEmail": "luojianyuan@bjmu.edu.cn"
  }
];

const emailData = [
  { 
    "id": "88de82c6-3181-4833-9f4e-b801b9e2f0db",
    "contributorAddress": "Department of Medical Genetics, Center for Medical Genetics\nPeking University Health Science Center\nBeijing 100191, China"
  }
];

const findById = ( docs, id ) => _.find( docs, { 'id': id } );
const getDocData = id => _.assign( {}, findById( documents, id ), findById( emailData, id ) );

module.exports = {
  getDocData
};