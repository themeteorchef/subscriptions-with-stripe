import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import Customers from '../../api/customers/customers';
import PlansCollection from '../../api/plans/plans';
import Plans from '../components/Plans';
import { epochToHuman } from '../../modules/dates';

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartSubscription = this.handleStartSubscription.bind(this);
    this.handleChangeSubscription = this.handleChangeSubscription.bind(this);
    this.handleCancelSubscription = this.handleCancelSubscription.bind(this);
    this.getSubscription = this.getSubscription.bind(this);
    this.renderSubscriptionStatus = this.renderSubscriptionStatus.bind(this);
  }

  handleStartSubscription() {

  }

  handleChangeSubscription() {

  }

  handleCancelSubscription() {

  }


  getSubscription() {
    const { customer, plans } = this.props;
    return {
      status: customer.subscription.status,
      plan: _.findWhere(plans, { planId: customer.subscription.plan }),
      current_period_end: epochToHuman(customer.subscription.current_period_end),
    };
  }

  renderSubscriptionStatus() {
    const subscription = this.getSubscription();
    const message = {
      active: { style: 'success', text: `You're subscribed to the ${subscription.plan.label} plan! Your subscription will renew on ${subscription.current_period_end}.` },
      cancelling: { style: 'warning', text: `Your subscription will end on ${subscription.current_period_end}.` },
      canceled: { style: 'danger', text: `Your subscription ended on ${subscription.current_period_end}.` },
      none: { style: 'info', text: <p>You don't have a plan. Shucks! <a href="#" onClick={this.handleSubscribe}>Subscribe now</a>.</p> },
      trialing: { style: 'success', text: `You're trialing until ${subscription.current_period_end}!` },
    }[subscription.status];
    return (<Alert bsStyle={message.style}>{message.text}</Alert>);
  }

  render() {
    const subscription = this.getSubscription();
    return (<div className="Subscription">
      {this.renderSubscriptionStatus()}
      <h5 className="page-header">Change Plan</h5>
      <Plans currentPlan={subscription.plan.planId} />
    </div>);
  }
}

Subscription.propTypes = {
  customer: PropTypes.object,
  plans: PropTypes.array,
};

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('customer.subscription');
  if (subscription.ready()) {
    const customer = Customers.findOne();
    const plans = PlansCollection.find().fetch();
    onData(null, { customer, plans });
  }
};

export default composeWithTracker(composer)(Subscription);
