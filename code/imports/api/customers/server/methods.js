import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import handleSignup from '../../../modules/server/stripe/handle-signup';
import handleCancelSubscription from '../../../modules/server/stripe/handle-cancel-subscription';
import handleChangeSubscription from '../../../modules/server/stripe/handle-change-subscription';
import handleUpdatePayment from '../../../modules/server/stripe/handle-update-payment';

Meteor.methods({
  signup(customer) {
    check(customer, Object);
    return handleSignup(customer)
    .then(subscription => subscription)
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
  changeSubscription(plan) {
    check(plan, String);
    return handleChangeSubscription({ userId: this.userId, newPlan: plan })
    .then(subscription => subscription)
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
  cancelSubscription() {
    return handleCancelSubscription(this.userId)
    .then(cancellation => cancellation)
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
  updatePayment(source) {
    check(source, String);
    return handleUpdatePayment({ userId: this.userId, source })
    .then(update => update)
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
});
