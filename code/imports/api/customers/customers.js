import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Customers = new Mongo.Collection('Customers');

Customers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Customers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const CustomersSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'The ID of the user this customer profile belongs to.',
  },
  customerId: {
    type: String,
    label: 'The user\'s customer ID on Stripe.',
  },
  'card.brand': {
    type: String,
    label: 'The brand of credit card the customer has on file.',
  },
  'card.last4': {
    type: String,
    label: 'The last four digits of the credit card the customer has on file.',
  },
  'subscription.id': {
    type: String,
    label: 'The ID of the user\'s subscription on Stripe.',
    optional: true,
  },
  'subscription.status': {
    type: String,
    allowedValues: ['active', 'cancelling', 'canceled', 'none', 'trialing'],
    label: 'The ID of the user\'s subscription on Stripe.',
    optional: true,
  },
  'subscription.plan': {
    type: String,
    label: 'The ID of the user\'s plan on Stripe.',
    optional: true,
  },
  'subscription.current_period_end': {
    type: Number,
    label: 'The next change date for the customer\'s subscription on Stripe (epoch timestamp in seconds).',
    optional: true,
  },
});

Customers.attachSchema(CustomersSchema);

export default Customers;
