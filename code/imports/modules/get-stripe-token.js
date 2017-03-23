/* eslint-disable new-cap */
/* global Stripe */

import stripe from './stripe';

export default card =>
new Promise((resolve, reject) => {
  stripe.createToken(card, (status, { error, id }) => {
    if (error) {
      reject(error.message);
    } else {
      resolve(id);
    }
  });
});
