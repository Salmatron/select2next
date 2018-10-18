import * as $ from '../../../vendor/jquery-2.1.0.js';

export function Translation(dict) {
    this.dict = dict || {};
}

Translation.prototype.all = function () {
    return this.dict;
};

Translation.prototype.get = function (key) {
    return this.dict[key];
};

Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
};

// Static functions

Translation._cache = {};

Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
        throw new Error('Not implemented yet.')

        // var translations = require(path);
        //
        // Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
};
