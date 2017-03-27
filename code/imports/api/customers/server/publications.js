import { Meteor } from 'meteor/meteor';
import Customers from '../customers';
import Plans from '../../plans/plans';
import Invoices from '../../invoices/invoices';

Meteor.publish('customer.subscription', function customerSubscription() {
  return [
    Customers.find({ userId: this.userId }),
    Plans.find({}, { fields: { label: 1, planId: 1 } }),
  ];
});

Meteor.publish('customer.invoices', function customerInvoices() {
  return Invoices.find({ userId: this.userId });
});
