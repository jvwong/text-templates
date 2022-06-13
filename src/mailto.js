import { mailto } from 'openurl';
import fs from 'fs';
import inquirer from 'inquirer';
import csv from 'csvtojson';
import Promise from 'bluebird';

const readFile = Promise.promisify( fs.readFile );

const DATA_PATH = `output/rendered-data.csv`;

const send = async (to, subject, body) => {
  mailto( [ to ], { subject, body });
};

const csv2json = async csvTxt => {
  const json = await csv().fromString(csvTxt);

  return json;
};

const main = async () => {
  const csvTxt = await readFile(DATA_PATH, 'utf8');
  const json = await csv2json(csvTxt);

  console.log(`Sending emails one by one:`);

  for( let i = 0; i < json.length; i++ ){
    const email = json[i];
    const { emailRecipientAddress: to, emailSubject: subject, emailText: body } = email;

    const answer = await inquirer.prompt({
      name: 'next',
      message: `(${i}) Send email to ${to}`,
      type: 'confirm'
    });

    if( answer.next ){
      await send(to, subject, body);
    }
  }
};

main();