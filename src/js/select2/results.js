import * as $ from 'jquery';

import {Utils} from './utils.js';

export function Results($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
}

Utils.Extend(Results, Utils.Observable);

Results.prototype.render = function () {
    const $results = $(
        '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
        $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
};

Results.prototype.clear = function () {
    this.$results.empty();
};

Results.prototype.displayMessage = function (params) {
    const escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    const $message = $(
        '<li role="treeitem" aria-live="assertive"' +
        ' class="select2-results__option"></li>'
    );

    const message = this.options.get('translations').get(params.message);

    $message.append(
        escapeMarkup(
            message(params.args)
        )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
};

Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
};

Results.prototype.append = function (data) {
    this.hideLoading();

    const $options = [];

    if (data.results == null || data.results.length === 0) {
        if (this.$results.children().length === 0) {
            this.trigger('results:message', {
                message: 'noResults'
            });
        }

        return;
    }

    data.results = this.sort(data.results);

    for (let d = 0; d < data.results.length; d++) {
        const item = data.results[d];

        const $option = this.option(item);

        $options.push($option);
    }

    this.$results.append($options);
};

Results.prototype.position = function ($results, $dropdown) {
    const $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
};

Results.prototype.sort = function (data) {
    const sorter = this.options.get('sorter');

    return sorter(data);
};

Results.prototype.highlightFirstItem = function () {
    const $options = this.$results
        .find('.select2-results__option[aria-selected]');

    const $selected = $options.filter('[aria-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
        // If there are selected options, highlight the first
        $selected.first().trigger('mouseenter');
    } else {
        // If there are no selected options, highlight the first option
        // in the dropdown
        $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
};

Results.prototype.setClasses = function () {
    const self = this;

    this.data.current(function (selected) {
        const selectedIds = $.map(selected, s => s.id.toString());

        const $options = self.$results
            .find('.select2-results__option[aria-selected]');

        $options.each(function () {
            const $option = $(this);

            const item = Utils.GetData(this, 'data');

            // id needs to be converted to a string when comparing
            const id = String(item.id);

            if ((item.element != null && item.element.selected) ||
                (item.element == null && $.inArray(id, selectedIds) > -1)) {
                $option.attr('aria-selected', 'true');
            } else {
                $option.attr('aria-selected', 'false');
            }
        });

    });
};

Results.prototype.showLoading = function (params) {
    this.hideLoading();

    const loadingMore = this.options.get('translations').get('searching');

    const loading = {
        disabled: true,
        loading: true,
        text: loadingMore(params)
    };
    const $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
};

Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
};

Results.prototype.option = function (data) {
    const option = document.createElement('li');
    option.className = 'select2-results__option';

    const attrs = {
        'role': 'treeitem',
        'aria-selected': 'false'
    };

    if (data.disabled) {
        delete attrs['aria-selected'];
        attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
        delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
        option.id = data._resultId;
    }

    if (data.title) {
        option.title = data.title;
    }

    if (data.children) {
        attrs.role = 'group';
        attrs['aria-label'] = data.text;
        delete attrs['aria-selected'];
    }

    for (let attr in attrs) {
        const val = attrs[attr];

        option.setAttribute(attr, val);
    }

    if (data.children) {
        const $option = $(option);

        const label = document.createElement('strong');
        label.className = 'select2-results__group';

        const $label = $(label);
        this.template(data, label);

        const $children = [];

        for (let c = 0; c < data.children.length; c++) {
            const child = data.children[c];

            const $child = this.option(child);

            $children.push($child);
        }

        const $childrenContainer = $('<ul></ul>', {
            'class': 'select2-results__options select2-results__options--nested'
        });

        $childrenContainer.append($children);

        $option.append(label);
        $option.append($childrenContainer);
    } else {
        this.template(data, option);
    }

    Utils.StoreData(option, 'data', data);

    return option;
};

Results.prototype.bind = function (container, $container) {
    const self = this;

    const id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
        self.clear();
        self.append(params.data);

        if (container.isOpen()) {
            self.setClasses();
            self.highlightFirstItem();
        }
    });

    container.on('results:append', function (params) {
        self.append(params.data);

        if (container.isOpen()) {
            self.setClasses();
        }
    });

    container.on('query', function (params) {
        self.hideMessages();
        self.showLoading(params);
    });

    container.on('select', function () {
        if (!container.isOpen()) {
            return;
        }

        self.setClasses();

        if (self.options.get('scrollAfterSelect')) {
            self.highlightFirstItem();
        }
    });

    container.on('unselect', function () {
        if (!container.isOpen()) {
            return;
        }

        self.setClasses();

        if (self.options.get('scrollAfterSelect')) {
            self.highlightFirstItem();
        }
    });

    container.on('open', function () {
        // When the dropdown is open, aria-expended="true"
        self.$results.attr('aria-expanded', 'true');
        self.$results.attr('aria-hidden', 'false');

        self.setClasses();
        self.ensureHighlightVisible();
    });

    container.on('close', function () {
        // When the dropdown is closed, aria-expended="false"
        self.$results.attr('aria-expanded', 'false');
        self.$results.attr('aria-hidden', 'true');
        self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
        const $highlighted = self.getHighlightedResults();

        if ($highlighted.length === 0) {
            return;
        }

        $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
        const $highlighted = self.getHighlightedResults();

        if ($highlighted.length === 0) {
            return;
        }

        const data = Utils.GetData($highlighted[0], 'data');

        if ($highlighted.attr('aria-selected') == 'true') {
            self.trigger('close', {});
        } else {
            self.trigger('select', {
                data
            });
        }
    });

    container.on('results:previous', function () {
        const $highlighted = self.getHighlightedResults();

        const $options = self.$results.find('[aria-selected]');

        const currentIndex = $options.index($highlighted);

        // If we are already at the top, don't move further
        // If no options, currentIndex will be -1
        if (currentIndex <= 0) {
            return;
        }

        let nextIndex = currentIndex - 1;

        // If none are highlighted, highlight the first
        if ($highlighted.length === 0) {
            nextIndex = 0;
        }

        const $next = $options.eq(nextIndex);

        $next.trigger('mouseenter');

        const currentOffset = self.$results.offset().top;
        const nextTop = $next.offset().top;
        const nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

        if (nextIndex === 0) {
            self.$results.scrollTop(0);
        } else if (nextTop - currentOffset < 0) {
            self.$results.scrollTop(nextOffset);
        }
    });

    container.on('results:next', function () {
        const $highlighted = self.getHighlightedResults();

        const $options = self.$results.find('[aria-selected]');

        const currentIndex = $options.index($highlighted);

        const nextIndex = currentIndex + 1;

        // If we are at the last option, stay there
        if (nextIndex >= $options.length) {
            return;
        }

        const $next = $options.eq(nextIndex);

        $next.trigger('mouseenter');

        const currentOffset = self.$results.offset().top +
            self.$results.outerHeight(false);
        const nextBottom = $next.offset().top + $next.outerHeight(false);
        const nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

        if (nextIndex === 0) {
            self.$results.scrollTop(0);
        } else if (nextBottom > currentOffset) {
            self.$results.scrollTop(nextOffset);
        }
    });

    container.on('results:focus', function (params) {
        params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
        self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
        this.$results.on('mousewheel', function (e) {
            const top = self.$results.scrollTop();

            const bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

            const isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
            const isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

            if (isAtTop) {
                self.$results.scrollTop(0);

                e.preventDefault();
                e.stopPropagation();
            } else if (isAtBottom) {
                self.$results.scrollTop(
                    self.$results.get(0).scrollHeight - self.$results.height()
                );

                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
        function (evt) {
            const $this = $(this);

            const data = Utils.GetData(this, 'data');

            if ($this.attr('aria-selected') === 'true') {
                if (self.options.get('multiple')) {
                    self.trigger('unselect', {
                        originalEvent: evt,
                        data
                    });
                } else {
                    self.trigger('close', {});
                }

                return;
            }

            self.trigger('select', {
                originalEvent: evt,
                data
            });
        });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
        function (evt) {
            const data = Utils.GetData(this, 'data');

            self.getHighlightedResults()
                .removeClass('select2-results__option--highlighted');

            self.trigger('results:focus', {
                data,
                element: $(this)
            });
        });
};

Results.prototype.getHighlightedResults = function () {
    const $highlighted = this.$results
        .find('.select2-results__option--highlighted');

    return $highlighted;
};

Results.prototype.destroy = function () {
    this.$results.remove();
};

Results.prototype.ensureHighlightVisible = function () {
    const $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
        return;
    }

    const $options = this.$results.find('[aria-selected]');

    const currentIndex = $options.index($highlighted);

    const currentOffset = this.$results.offset().top;
    const nextTop = $highlighted.offset().top;
    let nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    const offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
        this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
        this.$results.scrollTop(nextOffset);
    }
};

Results.prototype.template = function (result, container) {
    const template = this.options.get('templateResult');
    const escapeMarkup = this.options.get('escapeMarkup');

    const content = template(result, container);

    if (content == null) {
        container.style.display = 'none';
    } else if (typeof content === 'string') {
        container.innerHTML = escapeMarkup(content);
    } else {
        $(container).append(content);
    }
};
