window.module('Accessibility - Search');

import {MultipleSelection} from "../../src/js/select2/selection/multiple";
import {Search as InlineSearch} from "../../src/js/select2/selection/search";

import * as $ from 'jquery';

import {Utils} from "../../src/js/select2/utils";
import {Options} from "../../src/js/select2/options";
import {MockContainer} from "../helpers";

var options = new Options({});

test('aria-autocomplete attribute is present', function (assert) {
    var $select = $('#qunit-fixture .multiple');

    var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
    var selection = new CustomSelection($select, options);
    var $selection = selection.render();

    // Update the selection so the search is rendered
    selection.update([]);

    assert.equal(
        $selection.find('input').attr('aria-autocomplete'),
        'list',
        'The search box is marked as autocomplete'
    );
});

test('aria-activedescendant should be removed when closed', function (assert) {
    var $select = $('#qunit-fixture .multiple');

    var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
    var selection = new CustomSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    selection.bind(container, $('<span></span>'));

    // Update the selection so the search is rendered
    selection.update([]);

    var $search = $selection.find('input');
    $search.attr('aria-activedescendant', 'something');

    container.trigger('close');

    assert.ok(
        !$search.attr('aria-activedescendant'),
        'There is no active descendant when the dropdown is closed'
    );
});
