'use strict';

const https = require('https')

const commitsApi = id => `/api/v4/projects/${id}/repository/commits`;
const commitsApiQuery = (since, until) => `?since=${since}&until=${until}&with_stats=true`;

class CommitsCounter {
    constructor(gitlabHost, token) {
        this.gitlabHost = gitlabHost;
        this.token = token;
    }
    getCommits(id, since, until) {
        return new Promise((resolve, reject) => {
            https.get({
                hostname: this.gitlabHost,
                path: commitsApi(id) + commitsApiQuery(since, until),
                headers: {
                    'PRIVATE-TOKEN': this.token,
                },
            }, res => {
                let rawData = '';
                res.on('data', chunk => rawData += chunk);
                res.on('end', () => {
                    if (res.statusCode != 200) {
                        reject(rawData);
                    }
                    resolve(rawData);
                });
            }).on('error', e => reject(e));
        });
    }
    getStats(id, since, until) {
        return new Promise((resolve, reject) => {
            this.getCommits(id, since, until).then(r =>
                resolve(JSON.parse(r).reduce((ret, cur) => {
                    let authorName = cur['author_name'];
                    let stats = cur['stats'];
                    if (ret[authorName]) {
                        for (let key in ret[authorName]) {
                            ret[authorName][key] += stats[key];
                        }
                    } else {
                        ret[authorName] = stats;
                    }
                    return ret;
                }, {}))
            ).catch(e => reject(e));
        });
    }
}

module.exports = CommitsCounter;
