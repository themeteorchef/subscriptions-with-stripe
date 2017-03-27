/* eslint-disable consistent-return */

import Customers from '../api/customers/customers';
import Documents from '../api/documents/documents';

let action;

const planLimits = {
  large: 20,
  medium: 15,
  small: 10,
  tiny: 5,
};

const getCustomer = (userId) => {
  try {
    return Customers.findOne({ userId });
  } catch (exception) {
    action.reject(`[validateDocumentQuota.methodName] ${exception}`);
  }
};

const handler = ({ documentId, userId }, promise) => {
  try {
    action = promise;
    if (documentId) {
      action.resolve(); // If they're updating a document we don't care about quota.
    } else {
      const customer = getCustomer(userId);
      const limit = planLimits[customer.subscription.plan];
      const existingDocuments = Documents.find({ owner: userId }).count();
      const active = ['active', 'trialing', 'cancelling'].indexOf(customer.subscription.status) > -1;

      if (!active || existingDocuments >= limit) {
        action.reject('Upgrade your plan or delete some documents before creating anything new!');
      } else {
        action.resolve();
      }
    }
  } catch (exception) {
    action.reject(`[validateDocumentQuota.handler] ${exception}`);
  }
};

export default options =>
new Promise((resolve, reject) =>
handler(options, { resolve, reject }));
