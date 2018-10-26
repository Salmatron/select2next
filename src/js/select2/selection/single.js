import {BaseSelection} from './base.js';
import {Utils} from '../utils.js';

export function SingleSelection() {
    SingleSelection.__super__.constructor.apply(this, arguments);
}

Utils.Extend(SingleSelection, BaseSelection);

SingleSelection.prototype.render = function () {
    const $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
        '<span class="select2-selection__rendered"></span>' +
        '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
        '</span>'
    );

    return $selection;
};

SingleSelection.prototype.bind = function (container, $container) {
    const self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    const id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered')
        .attr('id', id)
        .attr('role', 'textbox')
        .attr('aria-readonly', 'true');
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
        // Only respond to left clicks
        if (evt.which !== 1) {
            return;
        }

        self.trigger('toggle', {
            originalEvent: evt
        });
    });

    this.$selection.on('focus', function (evt) {
        // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
        // User exits the container
    });

    container.on('focus', function (evt) {
        if (!container.isOpen()) {
            self.$selection.focus();
        }
    });
};

SingleSelection.prototype.clear = function () {
    const $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title'); // clear tooltip on empty
};

SingleSelection.prototype.display = function (data, container) {
    const template = this.options.get('templateSelection');
    const escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
};

SingleSelection.prototype.selectionContainer = () => $('<span></span>');

SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
        this.clear();
        return;
    }

    const selection = data[0];

    const $rendered = this.$selection.find('.select2-selection__rendered');
    const formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);
    $rendered.attr('title', selection.title || selection.text);
};
