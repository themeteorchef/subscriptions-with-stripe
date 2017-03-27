import { webhooks as stripe } from '../../modules/server/stripe';

export default {
  stripe(type, data) {
    const handler = stripe[type];
    if (handler) return handler(data);
    return `${type} is not supported.`;
  },
};
