import {Results as ResultsList} from './results.js';
import {SingleSelection} from "./selection/single.js";
import {MultipleSelection} from "./selection/multiple.js";
import {Placeholder} from './selection/placeholder.js';
import {AllowClear} from './selection/allowClear.js';
import {Search as SelectionSearch} from './selection/search.js';
import {EventRelay} from './selection/eventRelay.js';

import {Utils} from "./utils.js";
import {Translation} from "./translation.js";
import {diacritics as DIACRITICS} from "./diacritics.js";

import {SelectAdapter as SelectData } from './data/select.js';
import {ArrayAdapter as ArrayData} from './data/array.js';
import {AjaxAdapter as AjaxData} from "./data/ajax.js";
import {Tags} from "./data/tags.js";
import {Tokenizer} from "./data/tokenizer.js";
import {MinimumInputLength} from "./data/minimumInputLength.js";
import {MaximumInputLength} from "./data/maximumInputLength.js";
import {MaximumSelectionLength} from "./data/maximumSelectionLength.js";

import {Dropdown} from "./dropdown.js";
import {Search as DropdownSearch} from './dropdown/search.js';
import {HidePlaceholder} from './dropdown/hidePlaceholder.js';
import {InfiniteScroll} from "./dropdown/infiniteScroll.js";
import {AttachBody} from "./dropdown/attachBody.js";
import {MinimumResultsForSearch} from "./dropdown/minimumResultsForSearch.js";
import {SelectOnClose} from "./dropdown/selectOnClose.js";
import {CloseOnSelect} from "./dropdown/closeOnSelect.js";

import {Translated as EnglishTranslation} from "./i18n/en.js";

import {Query as CompatQuery} from "./compat/query.js";
import {InitSelection as CompatInitSelection} from "./compat/initSelection.js";
import {ContainerCSS as CompatContainerCss} from "./compat/containerCss.js";
import {DropdownCSS as CompatDropdownCss} from "./compat/dropdownCss.js";

function Defaults() {
    this.reset();
}

Defaults.prototype.apply = function (options) {
    options = Utils.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
        if (options.ajax != null) {
            options.dataAdapter = AjaxData;
        } else if (options.data != null) {
            options.dataAdapter = ArrayData;
        } else {
            options.dataAdapter = SelectData;
        }

        if (options.minimumInputLength > 0) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MinimumInputLength
            );
        }

        if (options.maximumInputLength > 0) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MaximumInputLength
            );
        }

        if (options.maximumSelectionLength > 0) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                MaximumSelectionLength
            );
        }

        if (options.tags) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
        }

        if (options.tokenSeparators != null || options.tokenizer != null) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                Tokenizer
            );
        }

        if (options.query != null) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,

                CompatQuery
            );
        }

        if (options.initSelection != null) {
            options.dataAdapter = Utils.Decorate(
                options.dataAdapter,
                CompatInitSelection
            );
        }
    }

    if (options.resultsAdapter == null) {
        options.resultsAdapter = ResultsList;

        if (options.ajax != null) {
            options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                InfiniteScroll
            );
        }

        if (options.placeholder != null) {
            options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                HidePlaceholder
            );
        }

        if (options.selectOnClose) {
            options.resultsAdapter = Utils.Decorate(
                options.resultsAdapter,
                SelectOnClose
            );
        }
    }

    if (options.dropdownAdapter == null) {
        if (options.multiple) {
            options.dropdownAdapter = Dropdown;
        } else {
            const SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

            options.dropdownAdapter = SearchableDropdown;
        }

        if (options.minimumResultsForSearch !== 0) {
            options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                MinimumResultsForSearch
            );
        }

        if (options.closeOnSelect) {
            options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                CloseOnSelect
            );
        }

        if (
            options.dropdownCssClass != null ||
            options.dropdownCss != null ||
            options.adaptDropdownCssClass != null
        ) {
            options.dropdownAdapter = Utils.Decorate(
                options.dropdownAdapter,
                CompatDropdownCss
            );
        }

        options.dropdownAdapter = Utils.Decorate(
            options.dropdownAdapter,
            AttachBody
        );
    }

    if (options.selectionAdapter == null) {
        if (options.multiple) {
            options.selectionAdapter = MultipleSelection;
        } else {
            options.selectionAdapter = SingleSelection;
        }

        // Add the placeholder mixin if a placeholder was specified
        if (options.placeholder != null) {
            options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                Placeholder
            );
        }

        if (options.allowClear) {
            options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                AllowClear
            );
        }

        if (options.multiple) {
            options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                SelectionSearch
            );
        }

        if (
            options.containerCssClass != null ||
            options.containerCss != null ||
            options.adaptContainerCssClass != null
        ) {
            options.selectionAdapter = Utils.Decorate(
                options.selectionAdapter,
                CompatContainerCss
            );
        }

        options.selectionAdapter = Utils.Decorate(
            options.selectionAdapter,
            EventRelay
        );
    }

    if (typeof options.language === 'string') {
        // Check if the language is specified with a region
        if (options.language.indexOf('-') > 0) {
            // Extract the region information if it is included
            const languageParts = options.language.split('-');
            const baseLanguage = languageParts[0];

            options.language = [options.language, baseLanguage];
        } else {
            options.language = [options.language];
        }
    }

    if (Array.isArray(options.language)) {
        const languages = new Translation();
        options.language.push('en');

        const languageNames = options.language;

        for (let l = 0; l < languageNames.length; l++) {
            let name = languageNames[l];
            let language = {};

            try {
                // Try to load it with the original name
                language = Translation.loadPath(name);
            } catch (e) {
                try {
                    // If we couldn't load it, check if it wasn't the full path
                    name = this.defaults.amdLanguageBase + name;
                    language = Translation.loadPath(name);
                } catch (ex) {
                    // The translation could not be loaded at all. Sometimes this is
                    // because of a configuration problem, other times this can be
                    // because of how Select2 helps load all possible translation files.
                    if (options.debug && window.console && console.warn) {
                        console.warn(
                            `Select2: The language file for "${name}" could not be ` +
                            'automatically loaded. A fallback will be used instead.'
                        );
                    }

                    continue;
                }
            }

            languages.extend(language);
        }

        options.translations = languages;
    } else {
        const baseTranslation = Translation.loadPath(
            this.defaults.amdLanguageBase + 'en'
        );
        const customTranslation = new Translation(options.language);

        customTranslation.extend(baseTranslation);

        options.translations = customTranslation;
    }

    return options;
};

Defaults.prototype.reset = function () {
    function stripDiacritics(text) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher(params, data) {
        // Always return the object if there is nothing to compare
        if (String(params.term).trim() === '') {
            return data;
        }

        // Do a recursive check for options with children
        if (data.children && data.children.length > 0) {
            // Clone the data object if there are children
            // This is required as we modify the object to remove any non-matches
            const match = Utils.extend(true, {}, data);

            // Check each child of the option
            for (let c = data.children.length - 1; c >= 0; c--) {
                const child = data.children[c];

                const matches = matcher(params, child);

                // If there wasn't a match, remove the object in the array
                if (matches == null) {
                    match.children.splice(c, 1);
                }
            }

            // If any children matched, return the new object
            if (match.children.length > 0) {
                return match;
            }

            // If there were no matching children, check just the plain object
            return matcher(params, match);
        }

        const original = stripDiacritics(data.text).toUpperCase();
        const term = stripDiacritics(params.term).toUpperCase();

        // Check if the text contains the term
        if (original.indexOf(term) > -1) {
            return data;
        }

        // If it doesn't contain the term, don't return anything
        return null;
    }

    this.defaults = {
        amdBase: './',
        amdLanguageBase: './i18n/',
        closeOnSelect: true,
        debug: false,
        dropdownAutoWidth: false,
        escapeMarkup: Utils.escapeMarkup,
        language: EnglishTranslation,
        matcher,
        minimumInputLength: 0,
        maximumInputLength: 0,
        maximumSelectionLength: 0,
        minimumResultsForSearch: 0,
        selectOnClose: false,
        scrollAfterSelect: false,
        sorter(data) {
            return data;
        },
        templateResult(result) {
            return result.text;
        },
        templateSelection(selection) {
            return selection.text;
        },
        theme: 'default',
        width: 'resolve'
    };
};

Defaults.prototype.set = function (key, value) {
    const camelKey = Utils.camelCase(key);

    const data = {};
    data[camelKey] = value;

    const convertedData = Utils._convertData(data);

    Utils.extend(true, this.defaults, convertedData);
};

export const defaults = new Defaults();
