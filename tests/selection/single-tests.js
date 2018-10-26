import {SingleSelection} from "../../src/js/select2/selection/single.js";
import {Options} from "../../src/js/select2/options.js";
import {Utils} from "../../src/js/select2/utils.js";

window.module('Selection containers - Single');

var options = new Options({});

test('display uses templateSelection', function (assert) {
    var called = false;

    var templateOptions = new Options({
        templateSelection: function (data) {
            called = true;

            return data.text;
        }
    });

    var selection = new SingleSelection(
        $('#qunit-fixture .single'),
        templateOptions
    );

    var out = selection.display({
        text: 'test'
    });

    assert.ok(called);

    assert.equal(out, 'test');
});

test('templateSelection can addClass', function (assert) {
    var called = false;

    var templateOptions = new Options({
        templateSelection: function (data, container) {
            called = true;
            container.addClass('testclass');
            return data.text;
        }
    });

    var selection = new SingleSelection(
        $('#qunit-fixture .single'),
        templateOptions
    );

    var $container = selection.selectionContainer();

    var out = selection.display({
        text: 'test'
    }, $container);

    assert.ok(called);

    assert.equal(out, 'test');

    assert.ok($container.hasClass('testclass'));
});

test('empty update clears the selection', function (assert) {
    var selection = new SingleSelection(
        $('#qunit-fixture .single'),
        options
    );

    var $selection = selection.render();
    var $rendered = $selection.find('.select2-selection__rendered');

    $rendered.text('testing');
    $rendered.attr('title', 'testing');

    selection.update([]);

    assert.equal($rendered.text(), '');
    assert.equal($rendered.attr('title'), undefined);
});

test('update renders the data text', function (assert) {
    var selection = new SingleSelection(
        $('#qunit-fixture .single'),
        options
    );

    var $selection = selection.render();
    var $rendered = $selection.find('.select2-selection__rendered');

    selection.update([{
        text: 'test'
    }]);

    assert.equal($rendered.text(), 'test');
});

test('escapeMarkup is being used', function (assert) {
    var selection = new SingleSelection(
        $('#qunit-fixture .single'),
        options
    );

    var $selection = selection.render();
    var $rendered = $selection.find('.select2-selection__rendered');

    var unescapedText = '<script>bad("stuff");</script>';

    selection.update([{
        text: unescapedText
    }]);

    assert.equal(
        $rendered.text(),
        unescapedText,
        'The text should be escaped by default to prevent injection'
    );
});
