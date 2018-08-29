'use strict';

const fs = require('fs');

const ChartsUploader = require('../progress/charts_uploader.js');
const CounterCharts = require('../progress/counter_charts.js');

const token = process.env.SLACK_API_TOKEN;

const conversationId = process.env.SLACK_TEST_CONVERSATION_ID;

const FILENAME = 'test/img/testimage.png';

describe('ChartsUploader', function () {
    this.timeout(10000);
    describe('#upload()', function () {
        it('should upload file', function () {
            let chartsUploader = new ChartsUploader(token);
            return chartsUploader.upload(FILENAME, fs.createReadStream(FILENAME), conversationId, 'test').catch(console.err);
        });
        it('should upload file from buffer', function () {
            let data = {
                iijima: { additions: 10, deletions: 2, total: 12 },
                test: { additions: 20, deletions: 20, total: 40 },
            };
            let counterCharts = new CounterCharts(500, 500);
            let chartsUploader = new ChartsUploader(token);
            return counterCharts.getCounterChartsBuffer(data).then(buffer =>
                chartsUploader.upload('chart.png', buffer, conversationId, 'test').catch(console.err)
            );
        });
    });
});
