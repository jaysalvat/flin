
(function ($) {
    'use strict';
    /* jshint laxbreak: true */ 

    $.fn.wrap = function (html) {
        return $.wrapWith(html);
    };

    $.fn.css = function (key, value) {
        if (typeof value === undefined) {
            return $.get(':' + key);
        }
        return $.set(':' + key, value);
    };

    $.fn.attr = function (key, value) {
        if (typeof value === undefined) {
            return $.get('@' + key);
        }
        return $.set('@' + key, value);
    };

    $.fn.removeAttr = function (key, value) {
        return $.set('@' + key, null);
    };

    $.fn.addClass = function (key)  {
        return $.set('.' + key);
    };

    $.fn.removeClass = function (key)  {
        return $.set('.' + key, 'remove');
    };

    $.fn.toggleClass = function (key)  {
        return $.set('.' + key, 'toggle');
    };

    $.fn.hasClass = function (key)  {
        return $.get('.' + key);
    };

    $.fn.first = function (key)  {
        return $.eq(0);
    };

    $.fn.last = function (key)  {
        return $.eq(this.length - 1);
    };

    $.fn.size = function () {
        return this.length;
    };

    $.fn.get = function (idx)  {
        if (idx === undefined) {
            return this.toArray();
        }

        if (idx < 0) {
            return this[idx + this.length];
        }

        return this[idx];
    };

    $.fn.toArray = function () {
        return [].slice.call(this);
    };

    $.fn.html = function (html) {
        if (html === undefined) {
            return this[0].innerHTML;
        }

        return this.each(function (i) {
            this.innerHTML = functionOrValue(value, this, i);
        });
    };

    $.fn.text = function (text) {
        if (text === undefined) {
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
}(Pin));
