import {SingleSelection} from "../../src/js/select2/selection/single.js";
import {StopPropagation} from "../../src/js/select2/selection/stopPropagation.js";
import {Options} from "../../src/js/select2/options.js";
import {Utils} from "../../src/js/select2/utils.js";
import {MockContainer} from "../helpers.js";

window.module('Selection containers - Stoping event propagation');

var CutomSelection = Utils.Decorate(SingleSelection, StopPropagation);

var options = new Options();

test('click event does not propagate', function (assert) {
    assert.expect(1);

    var $container = $('#qunit-fixture .event-container');
    var container = new MockContainer();

    var selection = new CutomSelection($('#qunit-fixture select'), options);

    var $selection = selection.render();
    selection.bind(container, $container);

    $container.append($selection);
    $container.on('click', function () {
        assert.ok(false, 'The click event should have been stopped');
    });

    $selection.trigger('click');

    assert.ok(true, 'Something went wrong if this failed');
});
