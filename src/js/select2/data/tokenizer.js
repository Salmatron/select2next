import * as $ from 'jquery';

export function Tokenizer(decorated, $element, options) {
    const tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
        this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
}

Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search = container.dropdown.$search || container.selection.$search ||
        $container.find('.select2-search__field');
};

Tokenizer.prototype.query = function (decorated, params, callback) {
    const self = this;

    function createAndSelect(data) {
        // Normalize the data object so we can use it for checks
        const item = self._normalizeItem(data);

        // Check if the data object already exists as a tag
        // Select it if it doesn't
        const $existingOptions = self.$element.find('option').filter(function () {
            return $(this).val() === item.id;
        });

        // If an existing option wasn't found for it, create the option
        if (!$existingOptions.length) {
            const $option = self.option(item);
            $option.attr('data-select2-tag', true);

            self._removeOldTags();
            self.addOptions([$option]);
        }

        // Select the item, now that we know there is an option for it
        select(item);
    }

    function select(data) {
        self.trigger('select', {
            data
        });
    }

    params.term = params.term || '';

    const tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
        // Replace the search term if we have the search box
        if (this.$search.length) {
            this.$search.val(tokenData.term);
            this.$search.focus();
        }

        params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
};

Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    const separators = options.get('tokenSeparators') || [];
    let { term } = params;
    let i = 0;

    const createTag = this.createTag || (params =>
        ({
            id: params.term,
            text: params.term
        })
    );

    while (i < term.length) {
        const termChar = term[i];

        if ($.inArray(termChar, separators) === -1) {
            i++;

            continue;
        }

        const part = term.substr(0, i);
        const partParams = $.extend({}, params, {
            term: part
        });

        const data = createTag(partParams);

        if (data == null) {
            i++;
            continue;
        }

        callback(data);

        // Reset the term to not include the tokenized portion
        term = term.substr(i + 1) || '';
        i = 0;
    }

    return {
        term
    };
};
