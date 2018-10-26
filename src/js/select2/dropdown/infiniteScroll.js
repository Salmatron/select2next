import {Utils} from "../utils.js";

export function InfiniteScroll(decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
}

InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
        this.$results.append(this.$loadingMore);
    }
};

InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    const self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
        self.lastParams = params;
        self.loading = true;
    });

    container.on('query:append', function (params) {
        self.lastParams = params;
        self.loading = true;
    });

    this.$results.on('scroll', function () {
        const isLoadMoreVisible = $.contains(
            document.documentElement,
            self.$loadingMore[0]
        );

        if (self.loading || !isLoadMoreVisible) {
            return;
        }

        const currentOffset = self.$results.offset().top +
            self.$results.outerHeight(false);
        const loadingMoreOffset = self.$loadingMore.offset().top +
            self.$loadingMore.outerHeight(false);

        if (currentOffset + 50 >= loadingMoreOffset) {
            self.loadMore();
        }
    });
};

InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    const params = Utils.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
};

InfiniteScroll.prototype.showLoadingMore = (_, data) => data.pagination && data.pagination.more;

InfiniteScroll.prototype.createLoadingMore = function () {
    const $option = $(
        '<li ' +
        'class="select2-results__option select2-results__option--load-more"' +
        'role="treeitem" aria-disabled="true"></li>'
    );

    const message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
};
