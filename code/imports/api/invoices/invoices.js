import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Invoices = new Mongo.Collection('Invoices');

Invoices.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Invoices.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const InvoicesSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'The ID of the user this invoice belongs to.',
  },
  date: {
    type: Number,
    label: 'The date this invoice was created (epoch timestamp in seconds).',
  },
  paid: {
    type: Boolean,
    label: 'Has this invoice been paid?',
  },
  amount_due: {
    type: Number,
    label: 'Amount due on the invoice.',
  },
  subtotal: {
    type: Number,
    label: 'Invoice subtotal',
  },
  total: {
    type: Number,
    label: 'Invoice total',
  },
  'lines.$.amount': {
    type: Number,
    label: 'Amount for the line item in cents.',
  },
  'lines.$.description': {
    type: String,
    label: 'Description for the line item.',
  },
  'lines.$.period.start': {
    type: Number,
    label: 'Start date for the line item (if subscription item).',
  },
  'lines.$.period.end': {
    type: Number,
    label: 'End date for the line item (if subscription item).',
  },
});

Invoices.attachSchema(InvoicesSchema);

export default Invoices;
