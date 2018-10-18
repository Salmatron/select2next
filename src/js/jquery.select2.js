import {Select2} from './select2/core.js';
import {defaults} from './select2/defaults.js';
import {Utils} from './select2/utils.js';

if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
        options = options || {};

        if (typeof options === 'object') {
            this.each(function () {
                var instanceOptions = $.extend(true, {}, options);

                var instance = new Select2($(this), instanceOptions);
            });

            return this;
        } else if (typeof options === 'string') {
            var ret;
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = Utils.GetData(this, 'select2');

                if (instance == null && window.console && console.error) {
                    console.error(
                        'The select2(\'' + options + '\') method was called on an ' +
            'element that is not using Select2.'
                    );
                }

                ret = instance[options].apply(instance, args);
            });

            // Check if we should be returning `this`
            if ($.inArray(options, thisMethods) > -1) {
                return this;
            }

            return ret;
        } else {
            throw new Error('Invalid arguments for Select2: ' + options);
        }
    };
}

if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = defaults;
}
