function formatCurrency (n, format, roundingFunction) {
    var symbolIndex = format.indexOf('$'),
        openParenIndex = format.indexOf('('),
        minusSignIndex = format.indexOf('-'),
        space = '',
        spliceIndex,
        output;

    // check for space before or after currency
    if (format.indexOf(' $') > -1) {
        space = ' ';
        format = format.replace(' $', '');
    } else if (format.indexOf('$ ') > -1) {
        space = ' ';
        format = format.replace('$ ', '');
    } else {
        format = format.replace('$', '');
    }

    // format the number
    output = formatNumber(n._value, format, roundingFunction);

    // position the symbol
    if (symbolIndex <= 1) {
        if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
            output = output.split('');
            spliceIndex = 1;
            if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                // the symbol appears before the "(" or "-"
                spliceIndex = 0;
            }
            output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
            output = output.join('');
        } else {
            output = languages[currentLanguage].currency.symbol + space + output;
        }
    } else {
        if (output.indexOf(')') > -1) {
            output = output.split('');
            output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
            output = output.join('');
        } else {
            output = output + space + languages[currentLanguage].currency.symbol;
        }
    }

    return output;
}