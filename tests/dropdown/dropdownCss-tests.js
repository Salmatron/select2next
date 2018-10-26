window.module('Dropdown - dropdownCssClass compatibility');

import {Utils} from "../../src/js/select2/utils.js";
import {Options} from "../../src/js/select2/options.js";
import {Dropdown} from "../../src/js/select2/dropdown.js";
import {DropdownCSS as CompatDropdownCss} from "../../src/js/select2/compat/dropdownCss.js";

var DropdownCSS = Utils.Decorate(Dropdown, CompatDropdownCss);

test('all classes will be copied if :all: is used', function (assert) {
    var $element = $('<select class="test copy works"></select>');
    var options = new Options({
        dropdownCssClass: ':all:'
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok($dropdown.hasClass('test'));
    assert.ok($dropdown.hasClass('copy'));
    assert.ok($dropdown.hasClass('works'));
    assert.ok(!$dropdown.hasClass(':all:'));
});

test(':all: can be used with other classes', function (assert) {
    var $element = $('<select class="test copy works"></select>');
    var options = new Options({
        dropdownCssClass: ':all: other'
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok($dropdown.hasClass('test'));
    assert.ok($dropdown.hasClass('copy'));
    assert.ok($dropdown.hasClass('works'));
    assert.ok($dropdown.hasClass('other'));
    assert.ok(!$dropdown.hasClass(':all:'));
});

test('classes can be passed in as a string', function (assert) {
    var $element = $('<select class="test copy works"></select>');
    var options = new Options({
        dropdownCssClass: 'other'
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok($dropdown.hasClass('other'));
});

test('a function can be used based on the element', function (assert) {
    var $element = $('<select class="test"></select>');
    var options = new Options({
        dropdownCssClass: function ($element) {
            return 'function';
        }
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok($dropdown.hasClass('function'));
    assert.ok(!$dropdown.hasClass('test'));
});

test(':all: works around custom adapters', function (assert) {
    var $element = $('<select class="test"></select>');
    var options = new Options({
        dropdownCssClass: ':all: something',
        adaptDropdownCssClass: function (clazz) {
            return clazz + '-modified';
        }
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok($dropdown.hasClass('something'));

    assert.ok($dropdown.hasClass('test'));
    assert.ok($dropdown.hasClass('test-modified'));
});

window.module('Dropdown - adaptDropdownCss compatibility');

test('only return when adapted', function (assert) {
    var $element = $('<select class="original"></select>');
    var options = new Options({
        adaptDropdownCssClass: function (clazz) {
            return 'modified';
        }
    });

    var select = new DropdownCSS($element, options);
    var $dropdown = select.render();

    assert.ok(!$dropdown.hasClass('original'));
    assert.ok($dropdown.hasClass('modified'));
});
