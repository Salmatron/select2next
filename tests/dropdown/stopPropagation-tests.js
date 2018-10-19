window.module('Dropdown - Stoping event propagation');

import {Dropdown} from "../../src/js/select2/dropdown";
import {StopPropagation} from "../../src/js/select2/dropdown/stopPropagation";

import * as $ from 'jquery';
import {Options} from "../../src/js/select2/options.js";
import {Utils} from "../../src/js/select2/utils.js";
import {MockContainer} from "../helpers.js";

var CustomDropdown = Utils.Decorate(Dropdown, StopPropagation);

var options = new Options();

test('click event does not propagate', function (assert) {
    assert.expect(1);

    var $container = $('#qunit-fixture .event-container');
    var container = new MockContainer();

    var dropdown = new CustomDropdown($('#qunit-fixture select'), options);

    var $dropdown = dropdown.render();
    dropdown.bind(container, $container);

    $container.append($dropdown);
    $container.on('click', function () {
        assert.ok(false, 'The click event should have been stopped');
    });

    $dropdown.trigger('click');

    assert.ok(true, 'Something went wrong if this failed');
});
