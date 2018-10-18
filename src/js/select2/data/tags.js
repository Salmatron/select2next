
export function Tags(decorated, $element, options) {
    const tags = options.get('tags');

    const createTag = options.get('createTag');

    if (createTag !== undefined) {
        this.createTag = createTag;
    }

    const insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
        for (let t = 0; t < tags.length; t++) {
            const tag = tags[t];
            const item = this._normalizeItem(tag);

            const $option = this.option(item);

            this.$element.append($option);
        }
    }
}

Tags.prototype.query = function (decorated, params, callback) {
    const self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
        decorated.call(this, params, callback);
        return;
    }

    function wrapper(obj, child) {
        const data = obj.results;

        for (let i = 0; i < data.length; i++) {
            const option = data[i];

            const checkChildren = (
                option.children != null &&
                !wrapper({
                    results: option.children
                }, true)
            );

            const optionText = (option.text || '').toUpperCase();
            const paramsTerm = (params.term || '').toUpperCase();

            const checkText = optionText === paramsTerm;

            if (checkText || checkChildren) {
                if (child) {
                    return false;
                }

                obj.data = data;
                callback(obj);

                return;
            }
        }

        if (child) {
            return true;
        }

        const tag = self.createTag(params);

        if (tag != null) {
            const $option = self.option(tag);
            $option.attr('data-select2-tag', true);

            self.addOptions([$option]);

            self.insertTag(data, tag);
        }

        obj.results = data;

        callback(obj);
    }

    decorated.call(this, params, wrapper);
};

Tags.prototype.createTag = function (decorated, params) {
    const term = $.trim(params.term);

    if (term === '') {
        return null;
    }

    return {
        id: term,
        text: term
    };
};

Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
};

Tags.prototype._removeOldTags = function (_) {
    const tag = this._lastTag;

    const $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
        if (this.selected) {
            return;
        }

        $(this).remove();
    });
};
