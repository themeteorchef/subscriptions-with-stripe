import { BrowserPolicy } from 'meteor/browser-policy-common';

BrowserPolicy.content.allowFontOrigin('data:');
BrowserPolicy.content.allowOriginForAll('*.stripe.com');
