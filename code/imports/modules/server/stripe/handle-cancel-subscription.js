/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import Customers from '../../../api/customers/customers';
import { cancelSubscription } from './index';

let action;

const getCustomer = (userId) => {
  try {
    return Customers.findOne({ userId });
  } catch (exception) {
    action.reject(`[handleCancelSubscription.getCustomer] ${exception}`);
  }
};

const handleCancelSubscription = (userId, promise) => {
  try {
    action = promise;
    const customer = getCustomer(userId);
    cancelSubscription(customer.subscription.id)
    .then(Meteor.bindEnvironment(({ current_period_end }) => {
      Customers.update(customer._id, {
        $set: {
          // Custom flag as Stripe returns 'active' for subscriptions that cancel at period end.
          // We'll receive a webhook from Stripe at period end with the 'canceled' status.
          // See: /imports/modules/server/stripe/webhooks/customer.subscription.deleted.js.
          'subscription.status': 'cancelling',
          'subscription.current_period_end': current_period_end,
        },
      });
    }))
    .catch(error => action.reject(error));
  } catch (exception) {
    action.reject(`[handleCancelSubscription] ${exception}`);
  }
};

export default userId =>
new Promise((resolve, reject) =>
handleCancelSubscription(userId, { resolve, reject }));
