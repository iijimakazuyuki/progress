'use strict';

const CommitsCounter = require('../progress/commits_counter.js');
const CounterCharts = require('../progress/counter_charts.js');
const ChartsUploader = require('../progress/charts_uploader.js');
const ProgressChartsUploader = require('../progress/progress_charts_uploader.js');

const token = process.env.SLACK_API_TOKEN;
const chartsUploader = new ChartsUploader(token);

const conversationId = process.env.SLACK_TEST_CONVERSATION_ID;

const gitlabToken = process.env.GITLAB_API_TOKEN;
const gitlabHost = process.env.GITLAB_HOST || 'gitlab.com';
const commitsCounter = new CommitsCounter(gitlabHost, gitlabToken);

const gitlabProjectIds = process.env.GITLAB_PROJECT_ID.split(',');

const WIDTH = process.env.CHART_WIDTH || 500;
const HEIGHT = process.env.CHART_HEIGHT || 500;
const counterCharts = new CounterCharts(WIDTH, HEIGHT);

const periodDays = process.env.PERIOD_DAYS || 7;

const progressChartsUploader = new ProgressChartsUploader(commitsCounter, counterCharts, chartsUploader, gitlabProjectIds, conversationId, periodDays);

describe('ProgressChartsUploader', function () {
    this.timeout(20000);
    describe('#exec()', function () {
        it('should run', function () {
            return new Promise(resolve =>
                progressChartsUploader.exec(null, resolve)
            );
        });
    });
});
