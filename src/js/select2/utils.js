
export const Utils = {
    Extend,
    Decorate,
    Observable,
    generateChars,
    _convertData,
    hasScroll,
    escapeMarkup,
    appendMany,
    StoreData,
    GetData,
    RemoveData,

    extend,
    isPlainObject,
    internalName,
    constructorName,
    typeName,
    camelCase,
};

function Extend(ChildClass, SuperClass) {
    const __hasProp = {}.hasOwnProperty;

    function BaseConstructor() {
        this.constructor = ChildClass;
    }

    for (let key in SuperClass) {
        if (__hasProp.call(SuperClass, key)) {
            ChildClass[key] = SuperClass[key];
        }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
}

function getMethods(TheClass) {
    const proto = TheClass.prototype;

    const methods = [];

    for (let methodName in proto) {
        const m = proto[methodName];

        if (typeof m !== 'function') {
            continue;
        }

        if (methodName === 'constructor') {
            continue;
        }

        methods.push(methodName);
    }

    return methods;
}

function Decorate(SuperClass, DecoratorClass) {
    const decoratedMethods = getMethods(DecoratorClass);
    const superMethods = getMethods(SuperClass);

    function DecoratedClass() {
        const argCount = DecoratorClass.prototype.constructor.length;

        let calledConstructor = SuperClass.prototype.constructor;

        if (argCount > 0) {
            Array.prototype.unshift.call(arguments, SuperClass.prototype.constructor);

            calledConstructor = DecoratorClass.prototype.constructor;
        }

        calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function Ctr() {
        this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new Ctr();

    for (let m = 0; m < superMethods.length; m++) {
        const superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] = SuperClass.prototype[superMethod];
    }

    const calledMethod = function (methodName) {
        // Stub out the original method if it's not decorating an actual method
        let originalMethod = function () {};

        if (methodName in DecoratedClass.prototype) {
            originalMethod = DecoratedClass.prototype[methodName];
        }

        const decoratedMethod = DecoratorClass.prototype[methodName];

        return function () {
            Array.prototype.unshift.call(arguments, originalMethod);

            return decoratedMethod.apply(this, arguments);
        };
    };

    for (let d = 0; d < decoratedMethods.length; d++) {
        const decoratedMethod = decoratedMethods[d];

        DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
}

function Observable() {
    this.listeners = {};
}

Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
        this.listeners[event].push(callback);
    } else {
        this.listeners[event] = [callback];
    }
};

Observable.prototype.trigger = function (event) {
    const { slice } = Array.prototype;
    let params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
        params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
        params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
        this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
        this.invoke(this.listeners['*'], arguments);
    }
};

Observable.prototype.invoke = function (listeners, params) {
    for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i].apply(this, params);
    }
};

function generateChars(length) {
    let chars = '';

    for (let i = 0; i < length; i++) {
        const randomChar = Math.floor(Math.random() * 36);
        chars += randomChar.toString(36);
    }

    return chars;
}

function _convertData(data) {
    for (let originalKey in data) {
        const keys = originalKey.split('-');

        let dataLevel = data;

        if (keys.length === 1) {
            continue;
        }

        for (let k = 0; k < keys.length; k++) {
            let key = keys[k];

            // Lowercase the first letter
            // By default, dash-separated becomes camelCase
            key = key.substring(0, 1).toLowerCase() + key.substring(1);

            if (!(key in dataLevel)) {
                dataLevel[key] = {};
            }

            if (k === (keys.length - 1)) {
                dataLevel[key] = data[originalKey];
            }

            dataLevel = dataLevel[key];
        }

        delete data[originalKey];
    }

    return data;
}

function hasScroll(index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    const $el = $(el);
    const { overflowX } = el.style;
    const { overflowY } = el.style;

    //Check both x and y declarations
    if (overflowX === overflowY && (overflowY === 'hidden' || overflowY === 'visible')) {
        return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
        return true;
    }

    return ($el.innerHeight() < el.scrollHeight || $el.innerWidth() < el.scrollWidth);
}

function escapeMarkup(markup) {
    const replaceMap = {
        '\\': '&#92;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
        return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, match => replaceMap[match]);
}

// Append an array of jQuery nodes to a given element.
function appendMany($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
        let $jqNodes = $();

        $.map($nodes, function (node) {
            $jqNodes = $jqNodes.add(node);
        });

        $nodes = $jqNodes;
    }

    $element.append($nodes);
}

// Cache objects in dataCache instead of $.data (see #4346)
let dataCache = new WeakMap();

function StoreData(element, name, value) {
    // Stores an item in the cache for a specified element.
    // name is the cache key.
    let elData = dataCache.get(element);

    if (elData == null) {
        elData =  {};
        dataCache.set(element, elData);
    }

    elData[name] = value;
}

function GetData(element, name) {
    // Retrieves a value from the cache by its key (name)
    // name is optional. If no name specified, return
    // all cache items for the specified element.
    // and for a specified element.
    const elData = dataCache.get(element);

    if (name) {
        if (elData) {
            return elData[name] != null ? elData[name]: $(element).data(name); // Fallback to HTML5 data attribs.
        }

        return $(element).data(name); // Fallback to HTML5 data attribs.
    } else {
        return elData;
    }
}

function RemoveData(element) {
    // Removes all cached items for a specified element.
    dataCache.delete(element);
}

/**
 * Inspired by jQuery.extend(), same function signature
 */
function extend(target/*, ...sources*/) {
    let options, name, src, copy, copyIsArray, clone,
        i = 1,
        length = arguments.length,
        deep = false;

    target || (target = {});

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( (typeof target !== "object") && ( typeof target !== 'function' ) ) {
        target = {};
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = arguments[ i ] ) != null ) {

            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( isPlainObject( copy ) ||
                        ( copyIsArray = Array.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && Array.isArray( src ) ? src : [];

                    } else {
                        clone = src && isPlainObject( src ) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = extend( deep, clone, copy );

                    // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}

function isPlainObject(obj) {
    let proto;

    return (obj != null) && (typeof obj === 'object') && (internalName(obj) === 'Object') && (((proto = Object.getPrototypeOf(obj)) === Object.prototype) || (proto === null));
}

/**
 * Gets the internal type/constructor name of the provided `val`
 * @param val
 * @returns {string}
 */
function internalName(val) {
    return Object.prototype.toString.call(val).slice(8, -1); // slice off the surrounding '[object ' and ']'
}

/**
 * @param obj
 * @returns {*}
 */
function constructorName(obj) {
    if ((obj != null) && (typeof obj.constructor === 'function') && (typeof obj.constructor.name === 'string')) {
        return obj.constructor.name;
    }
}

/**
 * @param obj
 * @returns {*}
 */
function typeName(obj) {
    let name = constructorName(obj);
    return ((name !== undefined) && (name !== '')) ? name : internalName(obj);
}

let rdashAlpha = /-([\da-z])/gi,
    fcamelCase = function (all, letter) {
        return letter.toUpperCase();
    };

function camelCase(string) {
    return string.replace( rdashAlpha, fcamelCase );
}
