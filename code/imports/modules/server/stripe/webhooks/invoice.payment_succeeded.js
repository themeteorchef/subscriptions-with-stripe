/* eslint-disable no-console, consistent-return */

import { Meteor } from 'meteor/meteor';
import Customers from '../../../../api/customers/customers.js';
import Invoices from '../../../../api/invoices/invoices.js';

const getDescription = (description, metadata) => {
  try {
    const hasDescription = metadata && metadata.description ? metadata.description : description;
    return hasDescription || 'No description';
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.getDescription] ${exception}`);
  }
};

const parseLines = (lines) => {
  try {
    return lines.map(({ amount, description, metadata, period }) => {
      return {
        amount,
        description: getDescription(description, metadata),
        period: {
          start: period.start,
          end: period.end,
        },
      };
    });
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

const invoicePaymentSucceeded = Meteor.bindEnvironment((webhook) => {
  try {
    let invoice;

    const invoiceType = webhook.data.object.object; // equals 'invoice' or 'charge'
    const invoiceData = webhook.data.object;
    const customerId = invoiceData.customer;
    const customer = Customers.findOne({ customerId });

    if (customer) {
      const user = Meteor.users.findOne(
        { _id: customer.userId },
        { fields: { emails: 1, profile: 1 } }
      );

      if (invoiceType === 'invoice') invoice = buildInvoice(user, invoiceData);
      if (invoiceType === 'charge') invoice = buildInvoiceFromCharge(user, invoiceData);
      if (invoice) Invoices.insert(invoice);
    } else {
      console.warn(`Customer ${invoiceData.customer} not found.`);
    }
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded] ${exception}`);
  }
});

export default invoicePaymentSucceeded;
