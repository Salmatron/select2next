import {KEYS} from '../keys.js';
import {Utils} from "../utils.js";

export function AllowClear() {
}

AllowClear.prototype.bind = function (decorated, container, $container) {
    const self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
        if (this.options.get('debug') && window.console && console.error) {
            console.error(
                'Select2: The `allowClear` option should be used in combination ' +
                'with the `placeholder` option.'
            );
        }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
        function (evt) {
            self._handleClear(evt);
        });

    container.on('keypress', function (evt) {
        self._handleKeyboardClear(evt, container);
    });
};

AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.options.get('disabled')) {
        return;
    }

    const $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
        return;
    }

    evt.stopPropagation();

    const data = Utils.GetData($clear[0], 'data');

    const previousVal = this.$element.val();
    this.$element.val(this.placeholder.id);

    let unselectData = {
        data
    };
    this.trigger('clear', unselectData);
    if (unselectData.prevented) {
        this.$element.val(previousVal);
        return;
    }

    for (let d = 0; d < data.length; d++) {
        unselectData = {
            data: data[d]
        };

        // Trigger the `unselect` event, so people can prevent it from being
        // cleared.
        this.trigger('unselect', unselectData);

        // If the event was prevented, don't clear it out.
        if (unselectData.prevented) {
            this.$element.val(previousVal);
            return;
        }
    }

    this.$element.trigger('change');

    this.trigger('toggle', {});
};

AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
        return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
        this._handleClear(evt);
    }
};

AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
        return;
    }

    const removeAll = this.options.get('translations').get('removeAllItems');

    const $remove = $(
        `<span class="select2-selection__clear" title="${removeAll()}">` +
        '&times;' +
        '</span>'
    );
    Utils.StoreData($remove[0], 'data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
};

