'use strict';

const getDateDaysAgo = (days) => {
    let ret = new Date();
    ret.setDate(ret.getDate() - days);
    return ret;
};
const makeFilename = date =>
    `commits_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.png`;

class ProgressChartsUploader {
    constructor(commitsCounter, counterCharts, chartsUploader, gitlabProjectId, conversationId, periodDays) {
        this.commitsCounter = commitsCounter;
        this.counterCharts = counterCharts;
        this.chartsUploader = chartsUploader;
        this.gitlabProjectId = gitlabProjectId;
        this.conversationId = conversationId;
        this.periodDays = periodDays;
    }
    exec(event, callback) {
        let since = getDateDaysAgo(this.periodDays).toISOString();
        let today = new Date();
        let until = today.toISOString();
        let filename = makeFilename(today);
        this.commitsCounter.getStats(this.gitlabProjectId, since, until).then(data =>
            this.counterCharts.getCounterChartsBuffer(data)
        ).then(buffer =>
            this.chartsUploader.upload(filename, buffer, this.conversationId)
        ).then(res => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Message sent: ${res.ts}`,
                    input: event,
                }),
            };
            callback(null, response);
        });

    }
}

module.exports = ProgressChartsUploader;