/************************************
    Numeral Prototype
************************************/


numeral.fn = Numeral.prototype = {

    clone : function () {
        return numeral(this);
    },


    /**
     * inputString,表示以何种类型的格式化  默认类型defaultFormat = '0,0',  
     * roundingFunction 暂时不清楚
     * 
     */
    format : function (inputString, roundingFunction) {
        return formatNumeral(this, 
              inputString ? inputString : defaultFormat, 
              (roundingFunction !== undefined) ? roundingFunction : Math.round
          );
    },

    unformat : function (inputString) {
        if (Object.prototype.toString.call(inputString) === '[object Number]') { 
            return inputString; 
        }
        return unformatNumeral(this, inputString ? inputString : defaultFormat);
    },

    value : function () {
        return this._value;
    },

    valueOf : function () {
        return this._value;
    },

    set : function (value) {
        this._value = Number(value);
        return this;
    },

    add : function (value) {
        var corrFactor = correctionFactor.call(null, this._value, value);
        function cback(accum, curr, currI, O) {
            return accum + corrFactor * curr;
        }
        this._value = [this._value, value].reduce(cback, 0) / corrFactor;
        return this;
    },

    subtract : function (value) {
        var corrFactor = correctionFactor.call(null, this._value, value);
        function cback(accum, curr, currI, O) {
            return accum - corrFactor * curr;
        }
        this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
        return this;
    },

    multiply : function (value) {
        function cback(accum, curr, currI, O) {
            var corrFactor = correctionFactor(accum, curr);
            return (accum * corrFactor) * (curr * corrFactor) /
                (corrFactor * corrFactor);
        }
        this._value = [this._value, value].reduce(cback, 1);
        return this;
    },

    divide : function (value) {
        function cback(accum, curr, currI, O) {
            var corrFactor = correctionFactor(accum, curr);
            return (accum * corrFactor) / (curr * corrFactor);
        }
        this._value = [this._value, value].reduce(cback);            
        return this;
    },

    difference : function (value) {
        return Math.abs(numeral(this._value).subtract(value).value());
    }

};