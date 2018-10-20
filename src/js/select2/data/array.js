import * as $ from 'jquery';

import {SelectAdapter} from './select.js';
import {Utils} from '../utils.js';

export function ArrayAdapter($element, options) {
    const data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
}

Utils.Extend(ArrayAdapter, SelectAdapter);

ArrayAdapter.prototype.select = function (data) {
    let $option = this.$element.find('option').filter((i, elm) => elm.value == data.id.toString());

    if ($option.length === 0) {
        $option = this.option(data);

        this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
};

ArrayAdapter.prototype.convertToOptions = function (data) {
    const self = this;

    const $existing = this.$element.find('option');
    const existingIds = $existing.map(function () {
        return self.item($(this)).id;
    }).get();

    const $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem(item) {
        return function () {
            return $(this).val() == item.id;
        };
    }

    for (let d = 0; d < data.length; d++) {
        const item = this._normalizeItem(data[d]);

        // Skip items which were pre-loaded, only merge the data
        if ($.inArray(item.id, existingIds) >= 0) {
            const $existingOption = $existing.filter(onlyItem(item));

            const existingData = this.item($existingOption);
            const newData = Utils.extend(true, {}, item, existingData);

            const $newOption = this.option(newData);

            $existingOption.replaceWith($newOption);

            continue;
        }

        const $option = this.option(item);

        if (item.children) {
            const $children = this.convertToOptions(item.children);

            Utils.appendMany($option, $children);
        }

        $options.push($option);
    }

    return $options;
};

