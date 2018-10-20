import * as $ from 'jquery';

import {ArrayAdapter} from './array.js';
import {Utils} from "../utils.js";

export function AjaxAdapter($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
        this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
}

Utils.Extend(AjaxAdapter, ArrayAdapter);

AjaxAdapter.prototype._applyDefaults = function (options) {
    const defaults = {
        data(params) {
            return Utils.extend({}, params, {
                q: params.term
            });
        },
        transport(params, success, failure) {
            const $request = $.ajax(params);

            $request.then(success);
            $request.fail(failure);

            return $request;
        }
    };

    return Utils.extend({}, defaults, options, true);
};

AjaxAdapter.prototype.processResults = results => results;

AjaxAdapter.prototype.query = function (params, callback) {
    const matches = [];
    const self = this;

    if (this._request != null) {
    // JSONP requests cannot always be aborted
        if ($.isFunction(this._request.abort)) {
            this._request.abort();
        }

        this._request = null;
    }

    const options = Utils.extend({
        type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
        options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
        options.data = options.data.call(this.$element, params);
    }

    function request() {
        var $request = options.transport(options, function (data) {
            const results = self.processResults(data, params);

            if (self.options.get('debug') && window.console && console.error) {
                // Check to make sure that the response included a `results` key.
                if (!results || !results.results || !$.isArray(results.results)) {
                    console.error(
                        'Select2: The AJAX results did not return an array in the ' +
            '`results` key of the response.'
                    );
                }
            }

            callback(results);
        }, function () {
            // Attempt to detect if a request was aborted
            // Only works if the transport exposes a status property
            if ('status' in $request &&
        ($request.status === 0 || $request.status === '0')) {
                return;
            }

            self.trigger('results:message', {
                message: 'errorLoading'
            });
        });

        self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
        if (this._queryTimeout) {
            window.clearTimeout(this._queryTimeout);
        }

        this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
        request();
    }
};
