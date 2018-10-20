import * as $ from 'jquery';

import {CompatUtils} from './utils.js';

// No-op CSS adapter that discards all classes by default
function _dropdownAdapter(clazz) {
    return null;
}

export function DropdownCSS() {
}

DropdownCSS.prototype.render = function (decorated) {
    const $dropdown = decorated.call(this);

    let dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if (typeof dropdownCssClass === 'function') {
        dropdownCssClass = dropdownCssClass(this.$element);
    }

    let dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
    dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;

    if (dropdownCssClass.indexOf(':all:') !== -1) {
        dropdownCssClass = dropdownCssClass.replace(':all:', '');

        const _cssAdapter = dropdownCssAdapter;

        dropdownCssAdapter = function (clazz) {
            const adapted = _cssAdapter(clazz);

            if (adapted != null) {
                // Append the old one along with the adapted one
                return adapted + ' ' + clazz;
            }

            return clazz;
        };
    }

    let dropdownCss = this.options.get('dropdownCss') || {};

    if (typeof dropdownCss === 'function') {
        dropdownCss = dropdownCss(this.$element);
    }

    CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);

    $dropdown.css(dropdownCss);
    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
};
