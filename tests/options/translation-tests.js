window.module('Options - Translations');

import * as $ from 'jquery';
import {Options} from "../../src/js/select2/options.js";

test('partial dictionaries can be passed', function (assert) {
    var options = new Options({
        language: {
            searching: function () {
                return 'Something';
            }
        }
    });

    var translations = options.get('translations');

    assert.equal(
        translations.get('searching')(),
        'Something',
        'The partial dictionary still overrides translations'
    );

    assert.equal(
        translations.get('noResults')(),
        'No results found',
        'You can still get English translations for keys not passed in'
    );
});
