/************************************
    Formatting
************************************/

// determine what type of formatting we need to do
function formatNumeral (n, format, roundingFunction) {
    var output;

    // figure out what kind of format we are dealing with
    if (format.indexOf('$') > -1) { // currency!!!!!
        output = formatCurrency(n, format, roundingFunction);
    } else if (format.indexOf('%') > -1) { // percentage
        output = formatPercentage(n, format, roundingFunction);
    } else if (format.indexOf(':') > -1) { // time
        output = formatTime(n, format);
    } else { // plain ol' numbers or bytes
        output = formatNumber(n._value, format, roundingFunction);
    }

    // return string
    return output;
}

