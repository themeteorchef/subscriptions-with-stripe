import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';
import validateDocumentQuota from '../../modules/validate-document-quota';

export const upsertDocument = new ValidatedMethod({
  name: 'documents.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    title: { type: String, optional: true },
    body: { type: String, optional: true },
  }).validator(),
  run(document) {
    document.owner = this.userId;

    if (Meteor.isServer) {
      return validateDocumentQuota({ documentId: document._id, userId: this.userId })
      .then(() => Documents.upsert({ _id: document._id }, { $set: document }))
      .catch((error) => {
        throw new Meteor.Error('500', `${error}`);
      });
    } else {
      return Documents.upsert({ _id: document._id }, { $set: document });
    }
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'documents.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Documents.remove(_id);
  },
});

rateLimit({
  methods: [
    upsertDocument,
    removeDocument,
  ],
  limit: 5,
  timeRange: 1000,
});
