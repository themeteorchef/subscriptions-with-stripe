/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Customers from '../../../api/customers/customers';
import { createCustomer, createSubscription } from './index';

let action;

const createCustomerInDatabase = Meteor.bindEnvironment((customer) => {
  try {
    return Customers.insert(customer);
  } catch (exception) {
    action.reject(`[handleSignup.createCustomerInDatabase] ${exception}`);
  }
});

const createSubscriptionOnStripe = ({ customer, plan }) => {
  try {
    return createSubscription({ customer, plan })
    .then(subscription => subscription)
    .catch(error => error);
  } catch (exception) {
    action.reject(`[handleSignup.createSubscriptionOnStripe] ${exception}`);
  }
};

const createCustomerOnStripe = ({ userId, profile, email }, source) => {
  try {
    return createCustomer({ email, source, metadata: profile.name })
    .then(({ id, sources }) => {
      const card = sources.data[0];
      return { card, id };
    })
    .catch(error => action.reject(error));
  } catch (exception) {
    action.reject(`[handleSignup.createCustomerOnStripe] ${exception}`);
  }
};

const createUser = ({ email, password, profile }) => {
  try {
    return Accounts.createUser({ email, password, profile });
  } catch (exception) {
    action.reject(`[handleSignup.createUser] ${exception}`);
  }
};

const handleSignup = (options, promise) => {
  try {
    action = promise;
    const userId = createUser(options.user);

    createCustomerOnStripe({ ...options.user, userId }, options.source)
    .then(Meteor.bindEnvironment((customer) => {
      createSubscriptionOnStripe({ userId, customer: customer.id, plan: options.user.plan })
      .then(({ id, status, items, current_period_end }) => {
        createCustomerInDatabase({
          userId,
          customerId: customer.id,
          card: { brand: customer.card.brand, last4: customer.card.last4 },
          subscription: { id, status, plan: items.data[0].plan.id, current_period_end },
        });
        action.resolve();
      });
    }))
    .catch(error => action.reject(`[handleSignup] ${error}`));
  } catch (exception) {
    action.reject(`[handleSignup] ${exception}`);
  }
};

export default customer =>
new Promise((resolve, reject) =>
handleSignup(customer, { resolve, reject }));
