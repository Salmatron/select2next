import {Utils} from "../../src/js/select2/utils.js";
import {Options} from "../../src/js/select2/options.js";
import {MockContainer} from "../helpers.js";
import {Dropdown} from "../../src/js/select2/dropdown.js";
import{AttachBody} from "../../src/js/select2/dropdown/attachBody.js";

window.module('Dropdown - attachBody - positioning');

test('appends to the dropdown parent', function (assert) {
    assert.expect(4);

    var $select = $('<select></select>');
    var $parent = $('<div></div>');

    var $container = $('<span></span>');
    var container = new MockContainer();

    $parent.appendTo($('#qunit-fixture'));
    $select.appendTo($parent);

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    assert.equal(
        $parent.children().length,
        1,
        'Only the select should be in the container'
    );

    var $dropdown = dropdown.render();

    dropdown.bind(container, $container);

    dropdown.position($dropdown, $container);

    assert.equal(
        $parent.children().length,
        1,
        'The dropdown should not be placed until after it is opened'
    );

    dropdown._showDropdown();

    assert.equal(
        $parent.children().length,
        2,
        'The dropdown should now be in the container as well'
    );

    assert.ok(
        $.contains($parent[0], $dropdown[0]),
        'The dropdown should be contained within the parent container'
    );
});

test('dropdown is positioned down with static margins', function (assert) {
    var $select = $('<select></select>');
    var $parent = $('<div></div>');
    $parent.css({
        position: 'static',
        marginTop: '5px',
        marginLeft: '10px'
    });

    var $container = $('<span>test</span>');
    var container = new MockContainer();

    $('#qunit-fixture').empty();

    $parent.appendTo($('#qunit-fixture'));
    $container.appendTo($parent);

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    var $dropdown = dropdown.render();

    assert.equal(
        $dropdown[0].style.top,
        0,
        'The drodpown should not have any offset before it is displayed'
    );

    dropdown.bind(container, $container);
    dropdown.position($dropdown, $container);
    dropdown._showDropdown();

    assert.ok(
        dropdown.$dropdown.hasClass('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        $dropdown.css('top').substring(0, 2),
        $container.outerHeight() + 5,
        'The offset should be 5px at the top'
    );

    assert.equal(
        $dropdown.css('left'),
        '10px',
        'The offset should be 10px on the left'
    );
});

test('dropdown is positioned down with absolute offsets', function (assert) {
    var $select = $('<select></select>');
    var $parent = $('<div></div>');
    $parent.css({
        position: 'absolute',
        top: '10px',
        left: '5px'
    });

    var $container = $('<span>test</span>');
    var container = new MockContainer();

    $parent.appendTo($('#qunit-fixture'));
    $container.appendTo($parent);

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    var $dropdown = dropdown.render();

    assert.equal(
        $dropdown[0].style.top,
        0,
        'The drodpown should not have any offset before it is displayed'
    );

    dropdown.bind(container, $container);
    dropdown.position($dropdown, $container);
    dropdown._showDropdown();

    assert.ok(
        dropdown.$dropdown.hasClass('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        $dropdown.css('top').substring(0, 2),
        $container.outerHeight(),
        'There should not be an extra top offset'
    );

    assert.equal(
        $dropdown.css('left'),
        '0px',
        'There should not be an extra left offset'
    );
});
