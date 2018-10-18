
export function Placeholder(decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
}

Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
        placeholder = {
            id: '',
            text: placeholder
        };
    }

    return placeholder;
};

Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    const $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
        .removeClass('select2-selection__choice');

    return $placeholder;
};

Placeholder.prototype.update = function (decorated, data) {
    const singlePlaceholder = (
        data.length == 1 && data[0].id != this.placeholder.id
    );
    const multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
        return decorated.call(this, data);
    }

    this.clear();

    const $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
};

