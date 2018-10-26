window.module('Defaults - Ajax');

import {defaults} from "../../src/js/select2/defaults.js";

test('options are merged recursively with default options', function (assert) {
    var ajaxDelay = 250;
    var ajaxUrl = 'http://www.test.com';

    var mergedOptions;

    defaults.set('ajax--delay', ajaxDelay);

    mergedOptions = defaults.apply({
        ajax: {
            url: ajaxUrl
        }
    });

    assert.equal(
        mergedOptions.ajax.delay,
        ajaxDelay,
        'Ajax default options are present on the merged options'
    );

    assert.equal(
        mergedOptions.ajax.url,
        ajaxUrl,
        'Ajax provided options are present on the merged options'
    );

    defaults.reset();
});

test('more than one default option can be changed via set()', function (assert) {
    var ajaxDelay = 123;
    var dataDataType = 'xml';
    defaults.set('ajax--delay', ajaxDelay);
    defaults.set('ajax--data-type', dataDataType);

    assert.equal(
        defaults.defaults.ajax.delay,
        ajaxDelay,
        'Both ajax.delay and ajax.dataType present in defaults');
    assert.equal(
        defaults.defaults.ajax.dataType,
        dataDataType,
        'Both ajax.delay and ajax.dataType present in defaults');
    defaults.reset();
});
