import {BaseAdapter as BaseData} from "../../src/js/select2/data/base.js";
import {Options} from "../../src/js/select2/options.js";

window.module('Data adapters - Base');

var options = new Options({});

test('current is required', function (assert) {
    var data = new BaseData($('#qunit-fixture select'), options);

    assert.throws(
        function () {
            data.current(function () {});
        },
        'current has no default implementation'
    );
});

test('query is required', function (assert) {
    var data = new BaseData($('#qunit-fixture select'), options);

    assert.throws(
        function () {
            data.query({}, function () {});
        },
        'query has no default implementation'
    );
});
