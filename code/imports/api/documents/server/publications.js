import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents';

Meteor.publish('documents.list', function documentsList() {
  return Documents.find({ owner: this.userId });
});

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});
