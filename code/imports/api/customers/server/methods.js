import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import handleSignup from '../../../modules/server/handle-signup';

Meteor.methods({
  signup(customer) {
    check(customer, Object);
    return handleSignup(customer)
    .then(user => user)
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
});
