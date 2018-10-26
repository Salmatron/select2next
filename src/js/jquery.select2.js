import {Select2} from './select2/core.js';
import {defaults} from './select2/defaults.js';
import {Utils} from './select2/utils.js';

export default Select2;

if ($.fn.select2 == null) {
    // All methods that should return the element
    const thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
        options = options || {};

        if (typeof options === 'object') {
            this.each(function () {
                const instanceOptions = Utils.extend(true, {}, options);

                const instance = new Select2($(this), instanceOptions);
            });

            return this;
        } else if (typeof options === 'string') {
            let ret;
            const args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                const instance = Utils.GetData(this, 'select2');

                if (instance == null && window.console && console.error) {
                    console.error(`The select2('${options}') method was called on an element that is not using Select2.`);
                }

                ret = instance[options].apply(instance, args);
            });

            // Check if we should be returning `this`
            if (thisMethods.indexOf(options) > -1) {
                return this;
            }

            return ret;
        } else {
            throw new Error(`Invalid arguments for Select2: ${options}`);
        }
    };
}

if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = defaults;
}
