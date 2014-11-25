/*! Pin v0.1.2 (c) 2014 Jay Salvat http://pin.jaysalvat.com */

(function ($) {
    'use strict';
    /* jshint laxbreak: true */ 

    $.fn.wrap = function (value) {
        return this.wrapWith(value);
    };

    $.fn.css = function (key, value) {
        if (value === undefined) {
            return this.get(':' + key);
        }
        
        return this.set(':' + key, value);
    };

    $.fn.attr = function (key, value) {
        if (value === undefined) {
            return $(this).get('@' + key);
        }
        
        return $(this).set('@' + key, value);
    };

    $.fn.removeAttr = function (key, value) {
        return $(this).set('@' + key);
    };

    $.fn.addClass = function (key)  {
        return $(this).set('.' + key);
    };

    $.fn.removeClass = function (key)  {
        return $(this).set('.' + key, 'remove');
    };

    $.fn.toggleClass = function (key)  {
        return $(this).set('.' + key, 'toggle');
    };

    $.fn.hasClass = function (key)  {
        return $(this).get('.' + key);
    };

    $.fn.first = function (key)  {
        return $(this).eq(0);
    };

    $.fn.last = function (key)  {
        return $(this).eq(this.length - 1);
    };

    $.fn.size = function () {
        return this.length;
    };

    $.fn.toArray = function () {
        return [].slice.call(this);
    };

    $.fn.html = function (value) {
        if (value === undefined) {
            return this[0].innerHTML;
        }

        return this.each(function (i) {
            this.innerHTML = functionOrValue(value, this, i);
        });
    };

    $.fn.text = function (value) {
        if (value === undefined) {
            return this[0].innerHTML || this[0].textContent;
        }

        return this.each(function (i) {
            this.textContent = functionOrValue(value, this, i);
        });
    };

    $.fn.data = function (key, value) {
        key = camelize(key);

        if (value === undefined) {
            return this[0].dataset[key];
        }

        return this.each(function (i) {
            this.dataset[key] = value;
        });
    };

    function functionOrValue (value, elmt, i) {
        if (typeof value === 'function') {
            return value.call(elmt, i);
        }

        return value;
    }

    function camelize (string) { 
        return string.replace(/-+(.)?/g, function (match, chr) { 
            return chr ? chr.toUpperCase() : '';
        });
    }

    // $.fn.get = function (idx)  {
    //     if (idx === undefined) {
    //         return this.toArray();
    //     }

    //     if (idx < 0) {
    //         return this[idx + this.length];
    //     }

    //     return this[idx];
    // };
}(Pin));
