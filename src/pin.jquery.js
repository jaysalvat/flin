
(function ($) {
    'use strict';
    /* jshint laxbreak: true */ 

    $.fn.wrap = function (html) {
        return $.wrapWith(html);
    };

    $.fn.css = function (key, value) {
        return $.set(':' + key, value);
    };

    $.fn.attr = function (key, value) {
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
}(Pin));
