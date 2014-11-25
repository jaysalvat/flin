/*! Pin v0.1.3 (c) 2014 Jay Salvat http://pin.jaysalvat.com */

(function (context, factory) {
    'use strict';
    /* globals define: true, module: true */

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        context.Pin = factory();

        if (context.$ === undefined) {
            context.$ = context.Pin;
        }
    }
})(this, function () {
    'use strict';
    /* jshint laxbreak: true, loopfunc: true */ 

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
        },
        tagRe = /^\s*<(\w+|!)[^>]*>/;


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
        else if (typeof selector === 'string') {
            selector = selector.trim();

            if (selector[0] === '<') {
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
        else if (typeof selector === 'object') {
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
            elmts,
            name = html.match(tagRe)[1];

        if (!containers[name]) {
            name = '*';
        }

        container = containers[name];
        container.innerHTML = html;

        elmts = $(container.childNodes).each(function () {
            container.removeChild(this);
        });

        return elmts;
    };

    $ = function (selector, context) {
        return pin.init(selector, context);
    };

    $.each = function (elmts, fn) {
        var i, k;

        if (typeof elmts.length === 'number') {
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

    $.map = function (elmts, fn) {
        var values = [],
            value;

        $(elmts).each(function (i) {
            value = fn.call(this, this, i);

            if (value !== null) {
                values.push(value);
            }
        });

        return values;
    };

    $.uniq = function (elmts) {
        return [].filter.call(elmts, function (elmt, idx) { 
            return elmts.indexOf(elmt) === idx;
        });
    };


    $.fn = {

        each: function (callback) {
            return $.each(this, callback);
        },

        map: function (callback) {
            return $($.map(this, callback));
        },

        find: function (selector) {
            var elmts = [];

            this.each(function () {
                elmts = elmts.concat($(this.querySelectorAll(selector)));
            });

            return $($.uniq(elmts));
        }
    };


    return $;
});
