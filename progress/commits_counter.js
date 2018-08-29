'use strict';

const https = require('https');
const { URL } = require('url');
const PER_PAGE = 100;

const commitsApi = id => `/api/v4/projects/${id}/repository/commits`;
const commitsApiQuery = (since, until) => `?since=${since}&until=${until}&with_stats=true&per_page=${PER_PAGE}`;

class CommitsCounter {
    constructor(gitlabHost, token) {
        this.gitlabHost = gitlabHost;
        this.token = token;
    }
    getPagedCommits(path) {
        return new Promise((resolve, reject) => {
            https.get({
                hostname: this.gitlabHost,
                path: path,
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
                    let data = JSON.parse(rawData);
                    if (res.headers.link) {
                        let nextMatchResult = /<([^>]+?)>; rel="next"/.exec(res.headers.link);
                        if (nextMatchResult) {
                            let nextUrl = new URL(nextMatchResult[1]);
                            this.getPagedCommits(`${nextUrl.pathname}${nextUrl.search}`).then(nextData =>
                                resolve(data.concat(nextData))
                            );
                            return;
                        }
                    }
                    resolve(data);
                });
            });
        });
    }
    getCommits(id, since, until) {
        return this.getPagedCommits(`${commitsApi(id)}${commitsApiQuery(since, until)}`);
    }
    getStats(id, since, until) {
        return new Promise((resolve, reject) => {
            this.getCommits(id, since, until).then(r =>
                resolve(r.reduce((ret, cur) => {
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
