/* eslint-disable new-cap */
/* global Stripe */

import { Meteor } from 'meteor/meteor';

let stripe;
const script = document.createElement('script');
script.src = 'https://js.stripe.com/v3/';
document.body.appendChild(script);

script.onload = () => { stripe = Stripe(Meteor.settings.public.stripe); }

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
