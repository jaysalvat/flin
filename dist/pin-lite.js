/*! Pin - Copyright (c) 2014 Jay Salvat
 *  v0.0.2 released 2014-11-14 11:21
 *  http://pin.jaysalvat.com
 */

/* globals define: true, module: true */
/* jshint laxbreak: true */

(function(context, factory) {
    "use strict";

    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        context.Pin = factory();

        if (context.$ === undefined) {
            context.$ = context.Pin;
        }
    }
})(this, function() {
    "use strict";

    var $, pin = {};

    pin.init = function(selector, context) {
        var elmts;

        if (!selector) {
            return new pin.Collection();
        }

        else if (pin.isCollection(selector)) {
            return selector;
        }

        else if (selector instanceof Function) {
            return document.addEventListener("DOMContentLoaded", selector);
        }

        else if (selector instanceof Array) {
            elmts = selector;
        }

        else if (typeof selector === 'string') {
            selector = selector.trim();

            if (context) {
                return $(context).find(selector);
            } 

            else {
                elmts = document.querySelectorAll(selector);
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

    pin.isCollection = function(object) {
        return (object.__pin);
    };

    pin.Collection = function(elmts) {
        elmts = elmts || [];
        elmts = [].slice.call(elmts);
        elmts.__pin = true;

        for (var k in $.fn) {
            if ($.fn.hasOwnProperty(k)) {
                elmts[k] = $.fn[k];
            }
        }
        
        return elmts;
    };

    $ = function(selector, context) {
        return pin.init(selector, context);
    };
    
    $.each = function (elmts, callback) {
        var i, k;

        if (typeof elmts.length === 'number') {
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
            value, 
            i, k;

        if (typeof elmts.length === 'number') {
            for (i = 0; i < elmts.length; i++) {
                value = callback.call(elmts[i], elmts[i], i);

                if (value !== null) {
                    values.push(value);
                }
            }

        } else {
            for (k in elmts) {
                if (elmts.hasOwnProperty(k)) {
                    value = callback.call(elmts[k], elmts[k], k);
                    
                    if (value !== null) {
                        values.push(value);
                    }
                }
            }
        }

        return values;
    };

    $.fn = {
        each: function (callback) {
            return $.each(this, callback);
        },

        map: function (callback) {
            var elmts = $.map(this, function(elmt, i) { 
                return callback.call(elmt, i, elmt); 
            });

            return $(elmts);
        },

        find: function (selector) {
            var elmts;

            if (!selector) {
                elmts = [];

            } else if (this.length === 1) {
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
