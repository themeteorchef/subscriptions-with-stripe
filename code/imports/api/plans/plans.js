import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Plans = new Mongo.Collection('Plans');

Plans.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Plans.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const PlansSchema = new SimpleSchema({
  planId: {
    type: String,
    label: 'The ID of the plan on Stripe.',
  },
  label: {
    type: String,
    label: 'Public facing label for the plan.',
  },
  price: {
    type: Number,
    label: 'Price of the plan in cents.',
  },
});

Plans.attachSchema(PlansSchema);

export default Plans;
