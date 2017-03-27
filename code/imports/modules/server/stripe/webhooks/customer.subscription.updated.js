/* eslint-disable no-console, consistent-return */

import Customers from '../../../../api/customers/customers';

const customerSubscriptionUpdated = ({ data }) => {
  try {
    const customer = Customers.findOne({ customerId: data.customer });

    if (customer) {
      Customers.update(customer._id, {
        $set: {
          'subscription.id': data.id,
          'subscription.status': status,
          'subscription.plan': data.plan.id,
          'subscription.current_period_end': data.current_period_end,
        },
      });
    }
  } catch (exception) {
    console.warn(`[customerSubscriptionUpdated] ${exception}`);
  }
};

export default customerSubscriptionUpdated;
