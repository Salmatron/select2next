import {BaseAdapter} from './base.js';
import {Utils} from '../utils.js';

export function SelectAdapter($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
}

Utils.Extend(SelectAdapter, BaseAdapter);

SelectAdapter.prototype.current = function (callback) {
    const data = [];
    const self = this;

    this.$element.find(':selected').each(function () {
        const $option = $(this);

        const option = self.item($option);

        data.push(option);
    });

    callback(data);
};

SelectAdapter.prototype.select = function (data) {
    const self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
        data.element.selected = true;

        this.$element.trigger('change');

        return;
    }

    if (this.$element.prop('multiple')) {
        this.current(function (currentData) {
            const val = [];

            data = [data];
            data.push.apply(data, currentData);

            for (let d = 0; d < data.length; d++) {
                const { id } = data[d];

                if ($.inArray(id, val) === -1) {
                    val.push(id);
                }
            }

            self.$element.val(val);
            self.$element.trigger('change');
        });
    } else {
        const val = data.id;

        this.$element.val(val);
        this.$element.trigger('change');
    }
};

SelectAdapter.prototype.unselect = function (data) {
    const self = this;

    if (!this.$element.prop('multiple')) {
        return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
        data.element.selected = false;

        this.$element.trigger('change');

        return;
    }

    this.current(function (currentData) {
        const val = [];

        for (let d = 0; d < currentData.length; d++) {
            const { id } = currentData[d];

            if (id !== data.id && $.inArray(id, val) === -1) {
                val.push(id);
            }
        }

        self.$element.val(val);

        self.$element.trigger('change');
    });
};

SelectAdapter.prototype.bind = function (container, $container) {
    const self = this;

    this.container = container;

    container.on('select', function (params) {
        self.select(params.data);
    });

    container.on('unselect', function (params) {
        self.unselect(params.data);
    });
};

SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
        // Remove any custom data set by Select2
        Utils.RemoveData(this);
    });
};

SelectAdapter.prototype.query = function (params, callback) {
    const data = [];
    const self = this;

    const $options = this.$element.children();

    $options.each(function () {
        const $option = $(this);

        if (!$option.is('option') && !$option.is('optgroup')) {
            return;
        }

        const option = self.item($option);

        const matches = self.matches(params, option);

        if (matches !== null) {
            data.push(matches);
        }
    });

    callback({
        results: data
    });
};

SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
};

SelectAdapter.prototype.option = function (data) {
    let option;

    if (data.children) {
        option = document.createElement('optgroup');
        option.label = data.text;
    } else {
        option = document.createElement('option');

        if (option.textContent !== undefined) {
            option.textContent = data.text;
        } else {
            option.innerText = data.text;
        }
    }

    if (data.id !== undefined) {
        option.value = data.id;
    }

    if (data.disabled) {
        option.disabled = true;
    }

    if (data.selected) {
        option.selected = true;
    }

    if (data.title) {
        option.title = data.title;
    }

    const $option = $(option);

    const normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    Utils.StoreData(option, 'data', normalizedData);

    return $option;
};

SelectAdapter.prototype.item = function ($option) {
    let data = {};

    data = Utils.GetData($option[0], 'data');

    if (data != null) {
        return data;
    }

    if ($option.is('option')) {
        data = {
            id: $option.val(),
            text: $option.text(),
            disabled: $option.prop('disabled'),
            selected: $option.prop('selected'),
            title: $option.prop('title')
        };
    } else if ($option.is('optgroup')) {
        data = {
            text: $option.prop('label'),
            children: [],
            title: $option.prop('title')
        };

        const $children = $option.children('option');
        const children = [];

        for (let c = 0; c < $children.length; c++) {
            const $child = $($children[c]);

            const child = this.item($child);

            children.push(child);
        }

        data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    Utils.StoreData($option[0], 'data', data);

    return data;
};

SelectAdapter.prototype._normalizeItem = function (item) {
    if (item !== Object(item)) {
        item = {
            id: item,
            text: item
        };
    }

    item = $.extend({}, {
        text: ''
    }, item);

    const defaults = {
        selected: false,
        disabled: false
    };

    if (item.id != null) {
        item.id = item.id.toString();
    }

    if (item.text != null) {
        item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
        item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
};

SelectAdapter.prototype.matches = function (params, data) {
    const matcher = this.options.get('matcher');

    return matcher(params, data);
};
