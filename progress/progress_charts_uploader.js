'use strict';

const getDateDaysAgo = (days) => {
    let ret = new Date();
    ret.setDate(ret.getDate() - days);
    return ret;
};
const makeFilename = date =>
    `commits_${dateFormat(date)}.png`;
const dateFormat = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const initialComment = (since, until) =>
    `Proogress Chart since ${dateFormat(since)} until ${dateFormat(until)}`;

const mergeCommitData = data => data.reduce((ret, cur) => {
    for (let authorName in cur) {
        if (ret[authorName]) {
            for (let key in ret[authorName]) {
                ret[authorName][key] += cur[authorName][key];
            }
        } else {
            ret[authorName] = cur[authorName];
        }
    }
    return ret;
}, {});

class ProgressChartsUploader {
    constructor(commitsCounter, counterCharts, chartsUploader, gitlabProjectIds, conversationId, periodDays) {
        this.commitsCounter = commitsCounter;
        this.counterCharts = counterCharts;
        this.chartsUploader = chartsUploader;
        this.gitlabProjectIds = gitlabProjectIds;
        this.conversationId = conversationId;
        this.periodDays = periodDays;
    }
    exec(event, callback) {
        let since = getDateDaysAgo(this.periodDays);
        let today = new Date();
        let until = today;
        let filename = makeFilename(today);
        Promise.all(this.gitlabProjectIds.map(gitlabProjectId =>
            this.commitsCounter.getStats(gitlabProjectId, since.toISOString(), until.toISOString())
        )).then(data =>
            this.counterCharts.getCounterChartsBuffer(mergeCommitData(data))
        ).then(buffer =>
            this.chartsUploader.upload(filename, buffer, this.conversationId, initialComment(since, until))
        ).then(res => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Created a progress chart since ${since} until ${until}.`,
                    input: event,
                }),
            };
            callback(null, response);
        });

    }
}

module.exports = ProgressChartsUploader;