import {Utils} from '../utils.js';

export function AttachBody(decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

    decorated.call(this, $element, options);
}

AttachBody.prototype.bind = function (decorated, container, $container) {
    const self = this;

    let setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
        self._showDropdown();
        self._attachPositioningHandler(container);

        if (!setupResultsEvents) {
            setupResultsEvents = true;

            container.on('results:all', function () {
                self._positionDropdown();
                self._resizeDropdown();
            });

            container.on('results:append', function () {
                self._positionDropdown();
                self._resizeDropdown();
            });
        }
    });

    container.on('close', function () {
        self._hideDropdown();
        self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
        evt.stopPropagation();
    });
};

AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
};

AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
        position: 'absolute',
        top: -999999
    });

    this.$container = $container;
};

AttachBody.prototype.render = function (decorated) {
    const $container = $('<span></span>');

    const $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
};

AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
};

AttachBody.prototype._attachPositioningHandler = function (decorated, container) {
    const self = this;

    const scrollEvent = `scroll.select2.${container.id}`;
    const resizeEvent = `resize.select2.${container.id}`;
    const orientationEvent = `orientationchange.select2.${container.id}`;

    const $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
        Utils.StoreData(this, 'select2-scroll-position', {
            x: $(this).scrollLeft(),
            y: $(this).scrollTop()
        });
    });

    $watchers.on(scrollEvent, function (ev) {
        const position = Utils.GetData(this, 'select2-scroll-position');
        $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
        function (e) {
            self._positionDropdown();
            self._resizeDropdown();
        });
};

AttachBody.prototype._detachPositioningHandler = function (decorated, container) {
    const scrollEvent = `scroll.select2.${container.id}`;
    const resizeEvent = `resize.select2.${container.id}`;
    const orientationEvent = `orientationchange.select2.${container.id}`;

    const $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
};

AttachBody.prototype._positionDropdown = function () {
    const $window = $(window);

    const isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    const isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    let newDirection = null;

    const offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    const container = {
        height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    const dropdown = {
        height: this.$dropdown.outerHeight(false)
    };

    const viewport = {
        top: $window.scrollTop(),
        bottom: $window.scrollTop() + $window.height()
    };

    const enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    const enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    const css = {
        left: offset.left,
        top: container.bottom
    };

    // Determine what the parent element is to use for calculating the offset
    let $offsetParent = this.$dropdownParent;

    // For statically positioned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
        $offsetParent = $offsetParent.offsetParent();
    }

    const parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
        newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
        newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
        newDirection = 'below';
    }

    if (newDirection == 'above' ||
    (isCurrentlyAbove && newDirection !== 'below')) {
        css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
        this.$dropdown
            .removeClass('select2-dropdown--below select2-dropdown--above')
            .addClass(`select2-dropdown--${newDirection}`);
        this.$container
            .removeClass('select2-container--below select2-container--above')
            .addClass(`select2-container--${newDirection}`);
    }

    this.$dropdownContainer.css(css);
};

AttachBody.prototype._resizeDropdown = function () {
    const css = {
        width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
        css.minWidth = css.width;
        css.position = 'relative';
        css.width = 'auto';
    }

    this.$dropdown.css(css);
};

AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
};
