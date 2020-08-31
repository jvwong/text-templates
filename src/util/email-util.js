import _ from 'lodash';

import {
  EMAIL_FROM,
  EMAIL_FROM_ADDR
} from '../config';

const msgFactory = opts => {
  const { emailRecipientAddress, emailText, emailSubject } = opts;

  const DEFAULTS = {
    from: {
      address: EMAIL_FROM_ADDR,
      name: EMAIL_FROM
    },
    to: 'someone@example.com'
  };

  const data = {
    to: emailRecipientAddress,
    subject: emailSubject,
    text: emailText
  };

  const mailOpts = _.defaultsDeep( data, DEFAULTS );
  return mailOpts;
};

export { msgFactory };