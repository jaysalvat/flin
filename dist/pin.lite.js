/*! Pin v0.1.8 (c) 2015 Jay Salvat http://pin.jaysalvat.com */
/* global define: true */
/* jshint eqeqeq: false, loopfunc: true, laxbreak: true */

(function (context, factory) {
    'use strict';
    
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define == 'function' && define.amd) {
        define([], factory);
    } else {
        context.Pin = factory();

        if (context.$ === undefined) {
            context.$ = context.Pin;
        }
    }
})(this, function () {
    'use strict';

    var $,
        pin   = {}, 
        win   = window,
        doc   = document,
        div   = doc.createElement('div'),
        table = doc.createElement('table'), 
        tbody = doc.createElement('tbody'),
        tr    = doc.createElement('tr'),
        containers = {
            'thead': table, 
            'tbody': table, 
            'tfoot': table,
            'tr':    tbody,
            'td':    tr, 
            'th':    tr,
            '*':     div
        };

    pin.init = function (selector, context) {
        var elmts;

        if (!selector) {
            return new pin.Collection();
        }
        else if (selector._pin) {
            return selector;
        }
        else if (selector instanceof Function) {
            return doc.addEventListener('DOMContentLoaded', selector);
        }
        else if (selector instanceof Array) {
            elmts = selector;
        }
        else if (typeof selector == 'string') {
            selector = selector.trim();

            if (selector[0] == '<') {
                elmts = pin.fragment(selector);
            }
            else if (context) {
                return $(context).find(selector);
            } 
            else {
                elmts = doc.querySelectorAll(selector);
            }
        }
        else if (selector instanceof NodeList) {
            elmts = selector;
        }
        else if (typeof selector == 'object') {
            elmts = [ selector ];
        }

        return new pin.Collection(elmts);
    };

    pin.Collection = function (elmts) {
        elmts = [].slice.call(elmts || []);
        elmts._pin = true;

        $.each($.fn, function (i) {
            elmts[i] = $.fn[i];
        });

        return elmts;
    };

    pin.fragment = function (html) {
        var container,
            name = html.match(/^\s*<(\w+|!)[^>]*>/)[1];

        if (!containers[name]) {
            name = '*';
        }

        container = containers[name];
        container.innerHTML = html;

        return $(container.childNodes).each(function () {
            container.removeChild(this);
        });
    };

    $ = function (selector, context) {
        return pin.init(selector, context);
    };

    $.each = function (elmts, fn) {
        var i, k;

        if (typeof elmts.length == 'number') {
            for (i = 0; i < elmts.length; i++) {
                if (fn.call(elmts[i], i, elmts[i]) === false) {
                    return elmts;
                }
            }
        } else {
            for (k in elmts) {
                if (elmts.hasOwnProperty(k)) {
                    if (fn.call(elmts[k], k, elmts[k]) === false) {
                        return elmts;
                    }
                }
            }
        }

        return elmts;
    };

    $.uniq = function (elmts) {
        return [].filter.call(elmts, function (elmt, idx) { 
            return elmts.indexOf(elmt) == idx;
        });
    };

    $.fn = {

        each: function (callback) {
            return $.each(this, callback);
        },

        find: function (selector) {
            var elmts = [];

            this.each(function () {
                elmts = elmts.concat($(this.querySelectorAll(selector)));
            });

            return $($.uniq(elmts));
        }
    };

    $.pin = '0.1.8';

    return $;
});
