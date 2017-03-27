/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import Customers from '../../../api/customers/customers';
import { updateCustomer } from './index';

let action;

const getCustomer = (userId) => {
  try {
    return Customers.findOne({ userId });
  } catch (exception) {
    action.reject(`[handleUpdatePayment.getCustomer] ${exception}`);
  }
};

const handleUpdatePayment = ({ userId, source }, promise) => {
  try {
    action = promise;
    const customer = getCustomer(userId);
    if (customer) {
      updateCustomer(customer.customerId, { source })
      .then(Meteor.bindEnvironment(({ sources }) => {
        const card = sources.data[0];
        Customers.update(customer._id, {
          $set: {
            card: {
              brand: card.brand,
              last4: card.last4,
            },
          },
        });
        action.resolve();
      }))
      .catch((exception) => {
        action.reject(`[handleUpdatePayment] ${exception}`);
      });
    }
  } catch (exception) {
    action.reject(`[handleUpdatePayment] ${exception}`);
  }
};

export default userId =>
new Promise((resolve, reject) =>
handleUpdatePayment(userId, { resolve, reject }));
