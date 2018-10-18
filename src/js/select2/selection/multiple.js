import {BaseSelection} from './base.js';
import {Utils} from '../utils.js';

export function MultipleSelection($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
}

Utils.Extend(MultipleSelection, BaseSelection);

MultipleSelection.prototype.render = function () {
    const $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
        '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
};

MultipleSelection.prototype.bind = function (container, $container) {
    const self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
        self.trigger('toggle', {
            originalEvent: evt
        });
    });

    this.$selection.on(
        'click',
        '.select2-selection__choice__remove',
        function (evt) {
            // Ignore the event if it is disabled
            if (self.options.get('disabled')) {
                return;
            }

            const $remove = $(this);
            const $selection = $remove.parent();

            const data = Utils.GetData($selection[0], 'data');

            self.trigger('unselect', {
                originalEvent: evt,
                data
            });
        }
    );
};

MultipleSelection.prototype.clear = function () {
    const $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title');
};

MultipleSelection.prototype.display = function (data, container) {
    const template = this.options.get('templateSelection');
    const escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
};

MultipleSelection.prototype.selectionContainer = function () {
    const $container = $(
        '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
        '&times;' +
        '</span>' +
        '</li>'
    );

    return $container;
};

MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
        return;
    }

    const $selections = [];

    for (let d = 0; d < data.length; d++) {
        const selection = data[d];

        const $selection = this.selectionContainer();
        const formatted = this.display(selection, $selection);

        $selection.append(formatted);
        $selection.attr('title', selection.title || selection.text);

        Utils.StoreData($selection[0], 'data', selection);

        $selections.push($selection);
    }

    const $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
};
