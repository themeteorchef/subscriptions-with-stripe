/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import Customers from '../../../api/customers/customers';
import { changeSubscription, createSubscription } from './index';

let action;

const updateCustomer = (customerId, { id, status, plan, current_period_end }) => {
  try {
    Customers.update(customerId, {
      $set: {
        'subscription.id': id,
        'subscription.status': status,
        'subscription.plan': plan.id,
        'subscription.current_period_end': current_period_end,
      },
    });
  } catch (exception) {
    module.reject(`[handleChangeSubscription.updateCustomer] ${exception}`);
  }
};

const getCustomer = (userId) => {
  try {
    return Customers.findOne({ userId });
  } catch (exception) {
    action.reject(`[handleChangeSubscription.getCustomer] ${exception}`);
  }
};

const handleChangeSubscription = ({ userId, newPlan }, promise) => {
  try {
    action = promise;
    const customer = getCustomer(userId);
    const status = customer.subscription.status;
    const hasSubscription = status === 'active' || status === 'trialing' || status === 'cancelling';

    if (hasSubscription) {
      changeSubscription(customer.subscription.id, { plan: newPlan })
      .then(Meteor.bindEnvironment((change) => {
        updateCustomer(customer._id, change);
        action.resolve();
      }))
      .catch(error => action.reject(error));
    } else {
      createSubscription({ customer: customer.customerId, plan: newPlan })
      .then(Meteor.bindEnvironment((change) => {
        updateCustomer(customer._id, { ...change });
        action.resolve();
      }))
      .catch(error => action.reject(error));
    }
  } catch (exception) {
    action.reject(`[handleChangeSubscription] ${exception}`);
  }
};

export default userId =>
new Promise((resolve, reject) =>
handleChangeSubscription(userId, { resolve, reject }));
