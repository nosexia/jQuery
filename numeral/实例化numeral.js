 /************************************
        Top Level Functions
************************************/

numeral = function (input) {
    if (numeral.isNumeral(input)) {
        input = input.value();
    } else if (input === 0 || typeof input === 'undefined') {
        input = 0;
    } else if (!Number(input)) {
        input = numeral.fn.unformat(input);
    }

    return new Numeral(Number(input));
};

// version number
numeral.version = VERSION;

// compare numeral object
numeral.isNumeral = function (obj) {
    return obj instanceof Numeral;
};

// This function will load languages and then set the global language.  If
// no arguments are passed in, it will simply return the current global
// language key.
numeral.language = function (key, values) {
    if (!key) {
        return currentLanguage;
    }

    if (key && !values) {
        if(!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        currentLanguage = key;
    }

    if (values || !languages[key]) {
        loadLanguage(key, values);
    }

    return numeral;
};

// This function provides access to the loaded language data.  If
// no arguments are passed in, it will simply return the current
// global language object.
numeral.languageData = function (key) {
    if (!key) {
        return languages[currentLanguage];
    }
    
    if (!languages[key]) {
        throw new Error('Unknown language : ' + key);
    }
    
    return languages[key];
};

numeral.language('en', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        var b = number % 10;
        return (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
    },
    currency: {
        symbol: '$'
    }
});

numeral.zeroFormat = function (format) {
    zeroFormat = typeof(format) === 'string' ? format : null;
};

numeral.defaultFormat = function (format) {
    defaultFormat = typeof(format) === 'string' ? format : '0.0';
};

/************************************
    Helpers
************************************/

function loadLanguage(key, values) {
    languages[key] = values;
}

/************************************
    Floating-point helpers
************************************/

// The floating-point helper functions and implementation
// borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

/**
 * Array.prototype.reduce for browsers that don't support it
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
 */
if ('function' !== typeof Array.prototype.reduce) {
    Array.prototype.reduce = function (callback, opt_initialValue) {
        'use strict';
        
        if (null === this || 'undefined' === typeof this) {
            // At the moment all modern browsers, that support strict mode, have
            // native implementation of Array.prototype.reduce. For instance, IE8
            // does not support strict mode, so this check is actually useless.
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        
        if ('function' !== typeof callback) {
            throw new TypeError(callback + ' is not a function');
        }

        var index,
            value,
            length = this.length >>> 0,
            isValueSet = false;

        if (1 < arguments.length) {
            value = opt_initialValue;
            isValueSet = true;
        }

        for (index = 0; length > index; ++index) {
            if (this.hasOwnProperty(index)) {
                if (isValueSet) {
                    value = callback(value, this[index], index, this);
                } else {
                    value = this[index];
                    isValueSet = true;
                }
            }
        }

        if (!isValueSet) {
            throw new TypeError('Reduce of empty array with no initial value');
        }

        return value;
    };
}


/**
 * Computes the multiplier necessary to make x >= 1,
 * effectively eliminating miscalculations caused by
 * finite precision.
 */
function multiplier(x) {
    var parts = x.toString().split('.');
    if (parts.length < 2) {
        return 1;
    }
    return Math.pow(10, parts[1].length);
}

/**
 * Given a variable number of arguments, returns the maximum
 * multiplier that must be used to normalize an operation involving
 * all of them.
 */
function correctionFactor() {
    var args = Array.prototype.slice.call(arguments);
    return args.reduce(function (prev, next) {
        var mp = multiplier(prev),
            mn = multiplier(next);
    return mp > mn ? mp : mn;
    }, -Infinity);
}        