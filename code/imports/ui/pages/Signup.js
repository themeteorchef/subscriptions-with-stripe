import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap';
import Plans from '../components/Plans';
import handleSignup from '../../modules/signup';

class Signup extends React.Component {
  componentDidMount() {
    handleSignup({ component: this });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="Signup">
        <Row>
          <Col xs={ 12 } sm={ 8 } smOffset={ 2 } md={ 6 } mdOffset={ 3 }>
            <h4 className="page-header">Account Information</h4>
            <form
              ref={ form => (this.signupForm = form) }
              onSubmit={ this.handleSubmit }
            >
              <Row>
                <Col xs={ 6 } sm={ 6 }>
                  <FormGroup>
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                      type="text"
                      ref="firstName"
                      name="firstName"
                      placeholder="First Name"
                    />
                  </FormGroup>
                </Col>
                <Col xs={ 6 } sm={ 6 }>
                  <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                      type="text"
                      ref="lastName"
                      name="lastName"
                      placeholder="Last Name"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <ControlLabel>Email Address</ControlLabel>
                <FormControl
                  type="text"
                  ref="emailAddress"
                  name="emailAddress"
                  placeholder="Email Address"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  ref="password"
                  name="password"
                  placeholder="Password"
                />
              </FormGroup>
              <h4 className="page-header">Payment Information</h4>
              <Row>
                <Col xs={ 12 }>
                  <Alert bsStyle="info"><strong>Select a plan size</strong>. When you sign up, your subscription will begin immediately (renewed monthly). Cancel anytime.</Alert>
                  <Plans currentPlan="medium" />
                </Col>
              </Row>
              <Button type="submit" bsStyle="success" block>Sign Up</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Signup;
