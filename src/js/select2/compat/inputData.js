import {Utils} from '../utils.js';

export function InputData(decorated, $element, options) {
    this._currentData = [];
    this._valueSeparator = options.get('valueSeparator') || ',';

    if ($element.prop('type') === 'hidden') {
        if (options.get('debug') && console && console.warn) {
            console.warn(
                'Select2: Using a hidden input with Select2 is no longer ' +
        'supported and may stop working in the future. It is recommended ' +
        'to use a `<select>` element instead.'
            );
        }
    }

    decorated.call(this, $element, options);
}

InputData.prototype.current = function (_, callback) {
    function getSelected(data, selectedIds) {
        const selected = [];

        if (data.selected || selectedIds.indexOf(data.id) !== -1) {
            data.selected = true;
            selected.push(data);
        } else {
            data.selected = false;
        }

        if (data.children) {
            selected.push.apply(selected, getSelected(data.children, selectedIds));
        }

        return selected;
    }

    const selected = [];

    for (let d = 0; d < this._currentData.length; d++) {
        const data = this._currentData[d];

        selected.push.apply(
            selected,
            getSelected(
                data,
                this.$element.val().split(
                    this._valueSeparator
                )
            )
        );
    }

    callback(selected);
};

InputData.prototype.select = function (_, data) {
    if (!this.options.get('multiple')) {
        this.current(function (allData) {
            $.map(allData, function (data) {
                data.selected = false;
            });
        });

        this.$element.val(data.id);
        this.$element.trigger('change');
    } else {
        let value = this.$element.val();
        value += this._valueSeparator + data.id;

        this.$element.val(value);
        this.$element.trigger('change');
    }
};

InputData.prototype.unselect = function (_, data) {
    const self = this;

    data.selected = false;

    this.current(function (allData) {
        const values = [];

        for (let d = 0; d < allData.length; d++) {
            const item = allData[d];

            if (data.id == item.id) {
                continue;
            }

            values.push(item.id);
        }

        self.$element.val(values.join(self._valueSeparator));
        self.$element.trigger('change');
    });
};

InputData.prototype.query = function (_, params, callback) {
    const results = [];

    for (let d = 0; d < this._currentData.length; d++) {
        const data = this._currentData[d];

        const matches = this.matches(params, data);

        if (matches !== null) {
            results.push(matches);
        }
    }

    callback({
        results
    });
};

InputData.prototype.addOptions = function (_, $options) {
    const options = $.map($options, $option => Utils.GetData($option[0], 'data'));

    this._currentData.push.apply(this._currentData, options);
};
