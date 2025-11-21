const Twilio = require('twilio');
const env = require('../config/env');
const logger = require('../utils/logger');

let client;
if (env.twilio.accountSid && env.twilio.authToken) {
  client = new Twilio(env.twilio.accountSid, env.twilio.authToken);
}

const sendSms = async (to, body) => {
  if (!client) {
    logger.warn('Twilio client not configured; skipping SMS');
    return null;
  }
  const message = await client.messages.create({
    from: env.twilio.fromNumber || undefined,
    messagingServiceSid: env.twilio.messagingServiceSid || undefined,
    to,
    body
  });
  return message.sid;
};

module.exports = {
  sendSms
};
