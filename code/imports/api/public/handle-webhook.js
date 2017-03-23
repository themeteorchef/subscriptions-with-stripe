import { webhooks as stripe } from '../../modules/server/stripe';

export default {
  stripe(type, data) {
    return stripe[type](data);
  },
};
