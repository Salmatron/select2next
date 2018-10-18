import {Translated} from "./i18n/en.js";

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
        // var translations = require(path);
        //
        // Translation._cache[path] = translations;

        if (path === './i18n/en') {
            Translation._cache[path] = Translated;
        } else {
            throw new Error('I18n is not implemented yet.')
        }
    }

    return new Translation(Translation._cache[path]);
};
