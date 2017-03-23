/* eslint-disable no-console, consistent-return */

import { Meteor } from 'meteor/meteor';
import Customers from '../../../../api/customers/customers.js';
import Invoices from '../../../../api/invoices/invoices.js';

const parseLines = (lines) => {
  try {
    return lines.map(({ amount, description, metadata, period }) => ({
      amount,
      description: metadata && metadata.description ? metadata.description : description,
      period: {
        start: period.start,
        end: period.end,
      },
    }));
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.parseLines] ${exception}`);
  }
};

const buildInvoiceFromCharge = (
  { _id },
  { created, paid, amount, description, invoice, period }
) => {
  try {
    return !invoice ? {
      userId: _id,
      date: created,
      paid,
      amount_due: amount,
      subtotal: amount,
      total: amount,
      lines: [{ amount, description, period }],
    } : null;
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.buildInvoiceFromCharge] ${exception}`);
  }
};

const buildInvoice = (
  { _id },
  { date, paid, amount_due, subtotal, total, lines }
) => {
  try {
    return {
      productService: 'membership',
      userId: _id,
      date,
      paid,
      amount_due,
      subtotal,
      total,
      lines: parseLines(lines.data),
    };
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.buildInvoice] ${exception}`);
  }
};

const invoicePaymentSucceeded = Meteor.bindEnvironment(({ data }) => {
  try {
    let invoice;
    let invoiceId;

    const { object } = data; // equals 'invoice' or 'charge'
    const customer = Customers.findOne({ customerId: data.customer });
    const user = Meteor.users.findOne(
      { _id: customer.userId },
      { fields: { emails: 1, profile: 1 } }
    );

    if (customer && user) {
      if (object === 'invoice') invoice = buildInvoice(user, data);
      if (object === 'charge') invoice = buildInvoiceFromCharge(user, data);
      if (invoice) invoiceId = Invoices.insert(invoice);
    }
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded] ${exception}`);
  }
});

export default invoicePaymentSucceeded;
