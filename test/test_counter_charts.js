'use strict';

const CounterCharts = require('../progress/counter_charts.js');
const FILENAME = 'testimage.png';

describe('CounterCharts', function () {
    describe('#writeCounterCharts()', function () {
        it('should write file', function () {
            let data = {
                iijima: { additions: 10, deletions: 2, total: 12 },
                test: { additions: 20, deletions: 20, total: 40 },
            };
            let counterCharts = new CounterCharts(500, 500);
            return counterCharts.writeCoutnerCharts(data, FILENAME);
        });
    });
});
