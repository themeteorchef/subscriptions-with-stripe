import React, { PropTypes } from 'react';
import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import Plans from '../../api/plans/plans';
import centsToDollars from '../../modules/cents-to-dollars';

class PlansList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { plan: props.currentPlan || 'small' };
  }

  render() {
    const { plans, currentPlan } = this.props;
    return (
      <div className="Plans">
        {plans.map(({ planId, label, price }) => {
          const isCurrentPlan = currentPlan === planId;
          return (
            <label key={ planId } className={`Plan ${isCurrentPlan ? 'current' : ''}`}>
              <input
                type="radio"
                name="plan"
                value={ planId }
                checked={ planId === this.state.plan }
                disabled={ isCurrentPlan }
                onChange={() => { this.setState({ plan: planId }); }}
              />
              { centsToDollars(price) } - { label }
            </label>
          );
        })}
      </div>
    );
  }
}

PlansList.propTypes = {
  plans: PropTypes.array,
  currentPlan: PropTypes.string,
};

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('plans');
  if (subscription.ready()) {
    const plans = Plans.find({}, { sort: { price: -1 } }).fetch();
    onData(null, { plans });
  }
};

export default composeWithTracker(composer)(PlansList);
