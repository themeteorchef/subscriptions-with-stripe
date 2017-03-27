import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import handleWebhook from './handle-webhook';

Picker.middleware(bodyParser.json());

Picker.route('/webhooks/:service', (params, request, response) => {
  const { body } = request;
  const service = handleWebhook[params.service];
  if (service) service(body.type, body);
  response.writeHead(200);
  response.end('[200] Webhook received.');
});
