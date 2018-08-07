'use strict';

const CommitsCounter = require('../progress/commits_counter.js');
const gitlabToken = process.env.GITLAB_API_TOKEN;
const ids = process.env.GITLAB_PROJECT_ID.split(',');
const GITLAB_HOST = 'gitlab.com';
const since = process.env.GITLAB_COMMITS_SINCE || '2018-04-01T00:00:00Z';
const until = process.env.GITLAB_COMMITS_UNTIL || '2018-12-31T00:00:00Z';

describe('CommitsCounter', function () {
    this.timeout(10000 * ids.length);
    describe('#getCommits()', function () {
        it('should get commits', function () {
            let commitsCounter = new CommitsCounter(GITLAB_HOST, gitlabToken);
            return Promise.all(ids.map(id =>
                commitsCounter.getCommits(id, since, until)
            )).then(console.log).catch(console.err);
        });
        it('should get commit stats', function () {
            let commitsCounter = new CommitsCounter(GITLAB_HOST, gitlabToken);
            return Promise.all(ids.map(id =>
                commitsCounter.getStats(id, since, until)
            )).then(console.log).catch(console.err);
        });
    });
});
