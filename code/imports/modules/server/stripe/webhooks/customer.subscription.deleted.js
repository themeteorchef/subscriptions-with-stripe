/* eslint-disable no-console, consistent-return */

import Customers from '../../../../api/customers/customers';

const customerSubscriptionDeleted = ({ data }) => {
  try {
    const customer = Customers.findOne({ customerId: data.customer });

    if (customer) {
      Customers.update(customer._id, {
        $unset: {
          'subscription.id': '',
          'subscription.plan': '',
          'subscription.current_period_end': '',
        },
        $set: {
          'subscription.status': 'none',
        },
      });
    }
  } catch (exception) {
    console.warn(`[customerSubscriptionDeleted] ${exception}`);
  }
};

export default customerSubscriptionDeleted;
