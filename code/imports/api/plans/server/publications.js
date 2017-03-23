import { Meteor } from 'meteor/meteor';
import Plans from '../plans';

Meteor.publish('plans', () => Plans.find());
