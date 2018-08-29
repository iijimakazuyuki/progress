'use strict';

const { WebClient } = require('@slack/client');

class ChartsUploader {
    constructor(token) {
        this.web = new WebClient(token);
    }
    upload(filename, file, conversationId, initialComment) {
        return this.web.files.upload({
            filename,
            file: file,
            channels: conversationId,
            initial_comment: initialComment,
        });
    }
}

module.exports = ChartsUploader;
