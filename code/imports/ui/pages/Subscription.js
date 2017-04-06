/* eslint-disable max-len */

import React, { PropTypes } from 'react';
import { Alert, ListGroup, ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Bert } from 'meteor/themeteorchef:bert';
import Customers from '../../api/customers/customers';
import Invoices from '../components/Invoices';
import Plans from '../components/Plans';
import Card from '../components/Card';
import PlansCollection from '../../api/plans/plans';
import { epochToHuman } from '../../modules/dates';

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { changingPlan: false, updatingPayment: false };

    this.handleChangeSubscription = this.handleChangeSubscription.bind(this);
    this.handleCancelSubscription = this.handleCancelSubscription.bind(this);
    this.handleUpdatePayment = this.handleUpdatePayment.bind(this);
    this.getSubscription = this.getSubscription.bind(this);
    this.renderSubscriptionStatus = this.renderSubscriptionStatus.bind(this);
    this.renderChangePlan = this.renderChangePlan.bind(this);
    this.renderUpdatePayment = this.renderUpdatePayment.bind(this);
  }

  handleChangeSubscription(event) {
    event.preventDefault();
    const planId = document.querySelector('[name="plan"]:checked').value;
    const newPlan = _.findWhere(this.props.plans, { planId });

    if (confirm(`Are you sure? This will change your plan to the ${newPlan.label}. If you're upgrading, your card will be charged any difference in price immediately.`)) {
      Meteor.call('changeSubscription', planId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          this.setState({ changingPlan: false });
          Bert.alert(`Plan changed to ${newPlan.label}!`, 'success');
        }
      });
    }
  }

  handleCancelSubscription(event) {
    event.preventDefault();
    const subscription = this.getSubscription();
    if (confirm(`Are you sure? You\'ll have access to Doxie until ${subscription.current_period_end}`)) {
      Meteor.call('cancelSubscription', (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Sorry to see you go! Thanks for being a customer :)', 'success');
        }
      });
    }
  }

  handleUpdatePayment(event) {
    event.preventDefault();
    window.stripe.createToken(this.cardForm.card)
    .then(({ token }) => {
      Meteor.call('updatePayment', token.id, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          this.setState({ updatingPayment: false });
          Bert.alert('Payment method updated!', 'success');
        }
      });
    })
    .catch((error) => {
      Bert.alert(error.reason, 'danger');
    });
  }

  getSubscription() {
    const { customer, plans } = this.props;
    return {
      status: customer.subscription.status,
      plan: _.findWhere(plans, { planId: customer.subscription.plan }) || { label: 'None' },
      current_period_end: epochToHuman(customer.subscription.current_period_end),
    };
  }

  renderSubscriptionStatus() {
    const subscription = this.getSubscription();
    const message = {
      active: {
        style: 'success',
        text: <p>Your subscription is <strong>active</strong> and <strong>will renew on {subscription.current_period_end}</strong>. <a className="cancel-link" href="#" onClick={this.handleCancelSubscription}>Cancel Subscription</a></p>,
      },
      cancelling: { style: 'warning', text: <p>Your subscription <strong>will end on {subscription.current_period_end}</strong>.</p> },
      canceled: { style: 'danger', text: <p>Your subscription ended on {subscription.current_period_end}.</p> },
      none: { style: 'info', text: <p>You don't have a plan. Shucks! <a href="#" onClick={this.handleSubscribe}>Subscribe now</a>.</p> },
      trialing: { style: 'success', text: <p>You're trialing until {subscription.current_period_end}! <a className="cancel-link" href="#" onClick={this.handleCancelSubscription}>Cancel Subscription</a></p> },
    }[subscription.status];
    return (<Alert bsStyle={message.style}>{message.text}</Alert>);
  }

  renderUpdatePayment() {
    const { customer } = this.props;
    const card = customer.card;
    return (<div className="UpdatePayment">
      <Card ref={cardForm => (this.cardForm = cardForm)} />
      <Button bsStyle="success" onClick={this.handleUpdatePayment}>Update Payment</Button>
    </div>);
  }

  renderChangePlan() {
    const { customer } = this.props;
    return (<div className="ChangePlan">
      <Plans currentPlan={customer.subscription.plan} />
      <Button bsStyle="success" onClick={this.handleChangeSubscription}>
        {customer.subscription.status === 'cancelling' ? 'Resubscribe' : 'Change Plan'}
      </Button>
    </div>);
  }

  render() {
    const subscription = this.getSubscription();
    const { customer } = this.props;
    const isCancelling = subscription.status === 'cancelling' ? `until ${subscription.current_period_end}` : '';

    return (<div className="Subscription">
      <ListGroup>
        <ListGroupItem>
          {this.renderSubscriptionStatus()}
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col xs={12} sm={3} md={3}>
              <p><strong>Plan</strong></p>
            </Col>
            <Col xs={12} sm={6} md={7}>
              <p>You're subscribed to the <strong>{subscription.plan.label}</strong> plan {isCancelling}</p>
            </Col>
            <Col xs={12} sm={3} md={2}>
              <Button
                onClick={() => { this.setState({ changingPlan: !this.state.changingPlan }); }}
                bsStyle="default"
                block
              >{this.state.changingPlan ? 'Cancel' : 'Change Plan'}</Button>
            </Col>
          </Row>
          {this.state.changingPlan ? this.renderChangePlan() : ''}
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col xs={12} sm={3} md={3}>
              <p><strong>Payment Method</strong></p>
            </Col>
            <Col xs={12} sm={6} md={7}>
              <p><strong>{customer.card.brand}</strong> ending in <strong>{customer.card.last4}</strong></p>
            </Col>
            <Col xs={12} sm={3} md={2}>
              <Button
                onClick={() => { this.setState({ updatingPayment: !this.state.updatingPayment }); }}
                bsStyle="default"
                block
              >{this.state.updatingPayment ? 'Cancel' : 'Update Payment'}</Button>
            </Col>
          </Row>
          {this.state.updatingPayment ? this.renderUpdatePayment() : ''}
        </ListGroupItem>
      </ListGroup>
      <Invoices />
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
