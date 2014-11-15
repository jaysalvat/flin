
/* globals define: true, module: true */
/* jshint laxbreak: true */

(function(context, factory) {
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
})(this, function() {
    'use strict';

    var $,
        pin = {}, 
        div    = document.createElement('div'),
        table  = document.createElement('table'), 
        tbody  = document.createElement('tbody'),
        tr     = document.createElement('tr'),
        containers = {
            '*':     div,
            'tr':    tbody,
            'tbody': table, 
            'thead': table, 
            'tfoot': table,
            'td':    tr, 
            'th':    tr
        },
        tagRe = /^\s*<(\w+|!)[^>]*>/;

    pin.init = function(selector, context) {
        var elmts;

        if (!selector) {
            return new pin.Collection();
        }

        else if (selector._pin) {
            return selector;
        }

        else if (selector instanceof Function) {
            return document.addEventListener('DOMContentLoaded', selector);
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
                elmts = document.querySelectorAll(selector);
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

    pin.Collection = function(elmts) {
        elmts = [].slice.call(elmts || []);
        elmts._pin = true;

        for (var k in $.fn) {
            if ($.fn.hasOwnProperty(k)) {
                elmts[k] = $.fn[k];
            }
        }
        
        return elmts;
    };

    pin.fragment = function (html) {
        var container,
            children,
            elmts,
            name = html.match(tagRe)[1];

        if (!containers[name]) {
            name = '*';
        }

        container = containers[name];
        container.innerHTML = html;

       // children = [].slice.call(container.childNodes);

        elmts = $(children).each(function() {
            container.removeChild(this);
        });

        return elmts;
    };

    $ = function(selector, context) {
        return pin.init(selector, context);
    };

    $.each = function (elmts, callback) {
        var i, k;

        if (typeof elmts.length == 'number') {
            for (i = 0; i < elmts.length; i++) {
                if (callback.call(elmts[i], i, elmts[i]) === false) {
                    return elmts;
                }
            }

        } else {
            for (k in elmts) {
                if (elmts.hasOwnProperty(k)) {
                    if (callback.call(elmts[k], k, elmts[k]) === false) {
                        return elmts;
                    }
                }
            }
        }

        return elmts;
    };

    $.map = function (elmts, callback) {
        var values = [],
            value;

        $(elmts).each(function (i) {
            value = callback.call(this, this, i);

            if (value !== null) {
                values.push(value);
            }
        });

        return values;
    };

    $.fn = {
        each: function (callback) {
            return $.each(this, callback);
        },

        map: function (callback) {
            return $($.map(this, callback));
        },

        find: function (selector) {
            var elmts;

            if (!selector) {
                elmts = [];

            } else if (this.length == 1) {
                elmts = this[0].querySelectorAll(selector);

            } else {
                elmts = this.map(function () { 
                    return this.querySelectorAll(selector);
                });
            }
            
            return $(elmts);
        }
    };

    return $;
});
