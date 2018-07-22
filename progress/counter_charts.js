'use strict';

const Chartjs = require('chartjs-node');

class CounterCharts {
    constructor(width, height) {
        this.chartjs = new Chartjs(width, height);
    }
    drawCounterCharts(data) {
        let labels = Object.keys(data);
        let additions = labels.map(l => data[l]['additions']);
        let deletions = labels.map(l => data[l]['deletions']);
        return this.chartjs.drawChart({
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'additions',
                        backgroundColor: 'rgba(54, 162, 255, 0.5)',
                        data: additions,
                    },
                    {
                        label: 'deletions',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: deletions,
                    },
                ],
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true,
                    }],
                },
            },
        });
    }
    getCounterChartsBuffer(data) {
        return this.drawCounterCharts(data).then(() =>
            this.chartjs.getImageBuffer('image/png')
        );
    }
    writeCoutnerCharts(data, filename) {
        return this.drawCounterCharts(data).then(() =>
            this.chartjs.writeImageToFile('image/png', filename)
        );
    }
}

module.exports = CounterCharts;
