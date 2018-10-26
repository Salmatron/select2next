import {InputData as InputCompat} from './compat/inputData.js';
import {defaults} from './defaults.js';
import {Utils} from './utils.js';

export function Options(options, $element) {
    this.options = options;

    if ($element != null) {
        this.fromElement($element);
    }

    this.options = defaults.apply(this.options);

    if ($element && $element.is('input')) {
        this.options.dataAdapter = Utils.Decorate(
            this.options.dataAdapter,
            InputCompat
        );
    }
}

Options.prototype.fromElement = function ($e) {
    const excludedData = ['select2'];

    if (this.options.multiple == null) {
        this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
        this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
        if ($e.prop('lang')) {
            this.options.language = $e.prop('lang').toLowerCase();
        } else if ($e.closest('[lang]').prop('lang')) {
            this.options.language = $e.closest('[lang]').prop('lang');
        }
    }

    if (this.options.dir == null) {
        if ($e.prop('dir')) {
            this.options.dir = $e.prop('dir');
        } else if ($e.closest('[dir]').prop('dir')) {
            this.options.dir = $e.closest('[dir]').prop('dir');
        } else {
            this.options.dir = 'ltr';
        }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if (Utils.GetData($e[0], 'select2Tags')) {
        if (this.options.debug && window.console && console.warn) {
            console.warn(
                'Select2: The `data-select2-tags` attribute has been changed to ' +
        'use the `data-data` and `data-tags="true"` attributes and will be ' +
        'removed in future versions of Select2.'
            );
        }

        Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
        Utils.StoreData($e[0], 'tags', true);
    }

    if (Utils.GetData($e[0], 'ajaxUrl')) {
        if (this.options.debug && window.console && console.warn) {
            console.warn(
                'Select2: The `data-ajax-url` attribute has been changed to ' +
        '`data-ajax--url` and support for the old attribute will be removed' +
        ' in future versions of Select2.'
            );
        }

        $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
        Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));

    }

    let dataset = Utils.GetData($e[0]);
    let data = Utils.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (let key in data) {
        if (excludedData.indexOf(key) > -1) {
            continue;
        }

        if (Utils.isPlainObject(this.options[key])) {
            Utils.extend(this.options[key], data[key]);
        } else {
            this.options[key] = data[key];
        }
    }

    return this;
};

Options.prototype.get = function (key) {
    return this.options[key];
};

Options.prototype.set = function (key, val) {
    this.options[key] = val;
};
