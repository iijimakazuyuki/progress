'use strict';

const { WebClient } = require('@slack/client');

const token = process.env.SLACK_API_TOKEN;

const web = new WebClient(token);

const conversationId = process.env.SLACK_CONVERSATION_ID;

module.exports.hello = (event, context, callback) => {
  web.chat.postMessage({
    channel: conversationId,
    text: 'Hello there!',
  }).then(res => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Message sent: ${res.ts}`,
        input: event,
      }),
    };
    callback(null, response);
  })
};
