import React, { PropTypes } from 'react';
import stripe from '../../modules/stripe';

class Card extends React.Component {
  componentDidMount() {
    stripe((s) => {
      this.elements = s.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');

      this.card.addEventListener('change', ({ error }) => {
        const displayError = document.querySelector('.card-errors');

        if (error) {
          displayError.textContent = error.message;
          displayError.style.display = 'block';
        } else {
          displayError.style.display = 'none';
        }
      });
    });
  }

  render() {
    return (<div className="Card">
      <div id="card-element" />
      <label className="card-errors" />
    </div>);
  }
}

Card.propTypes = {};

export default Card;
