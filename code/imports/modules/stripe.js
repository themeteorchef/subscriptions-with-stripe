/* eslint-disable new-cap, import/no-mutable-exports */
/* global Stripe */

import { Meteor } from 'meteor/meteor';

export default (callback) => {
  const existingScript = document.getElementById('stripejs');

  if (existingScript && callback) {
    callback(window.stripe);
  } else {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.id = 'stripejs';
    document.body.appendChild(script);

    script.onload = () => {
      window.stripe = Stripe(Meteor.settings.public.stripe);
      if (callback) callback(window.stripe);
    };
  }
};
