'use strict';

const { WebClient } = require('@slack/client');

class ChartsUploader {
    constructor(token) {
        this.web = new WebClient(token);
    }
    upload(filename, file, conversationId) {
        return this.web.files.upload({
            filename,
            file: file,
            channels: conversationId,
        });
    }
}

module.exports = ChartsUploader;
