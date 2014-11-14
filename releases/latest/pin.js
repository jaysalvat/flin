/*! Pin - Copyright (c) 2014 Jay Salvat
 *  v0.0.1 released 2014-11-14 01:24
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
        tagRe     = /^\s*<(\w+|!)[^>]*>/,
        cssStyles = getCssStyles(),
        cssPrefix = getCssPrefix();

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

            if (selector[0] === '<') {
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

        children = [].slice.call(container.childNodes);

        elmts = $.each(children, function() {
            container.removeChild(this);
        });

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

    $.extend = function(deep) {
        var obj  = {},
            args = [].slice.call(arguments),
            i, k;

        if (typeof deep === 'boolean') {
            args.shift();
        }

        for (i = 0; i < args.length; i++) {
            for (k in args[i]) {
                if (args[i].hasOwnProperty(k)) {
                    if (deep === true && typeof args[i][k] === 'object') {
                        obj[k] = $.extend(deep, obj[k], args[i][k]);
                    } else {
                        obj[k] = args[i][k];
                    }
                }
            }
        }

        return obj;
    };

    $.fn = {
        set: function (key, value) {
            return this.each(function () {
                if (key[0] === '@') {
                    if (value === undefined) {
                        this.removeAttribute(key.slice(1));
                    } else {
                        this.setAttribute(key.slice(1), value);
                    }
                } else {
                    this[key] = value;
                }
            });
        },

        get: function (key) {
            if (key[0] === '@') {
                return this[0].getAttribute(key.slice(1));
            }

            return this[0][key]; 
        },

        each: function (callback) {
            return $.each(this, callback);
        },

        map: function (callback) {
            var elmts = $.map(this, function(elmt, i) { 
                return callback.call(elmt, i, elmt); 
            });

            return $(elmts);
        },

        slice: function () {
            return $([].slice.apply(this, arguments));
        },

        eq: function (idx) {
            return this.slice(idx, + idx + 1);
        },

        index: function (elmt) {
            if (elmt) {
                return this.indexOf($(elmt)[0]);
            }

            return this.parent.childNodes.indexOf(this[0]);
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
        },

        parents: function (selector){
            var elmts   = this,
                parents = [];

            function findParents(elmts) {
                return $.map(elmts, function () {
                    var parent = this.parentNode;

                    if (parent && parent.nodeType !== 9 && parents.indexOf(parent) < 0) {
                        if (!selector || $(parent).is(selector)) {
                            parents.push(parent);
                        }
                        return parent;
                    }

                    return null;
                });
            }

            while (elmts.length > 0) {
                elmts = findParents(elmts);
            }

            return $(parents);
        },

        has: function (selector) {
            return !!$(this).find(selector).length;
        },

        is: function (selector) {
            if (!selector) {
                return false;
            }

            var elmts = $(this).map(function () {
                var matchesSelector = 
                    this.webkitMatchesSelector ||
                    this.mozMatchesSelector ||
                    this.oMatchesSelector ||
                    this.matchesSelector;

                if (this === selector || matchesSelector.call(this, selector)) {
                    return this;
                }

                return null;
            });

            return !!elmts.length;
        },

        replaceWith: function (html) {
            var elmt = $(html)[0];

            return this.map(function () {
                $(this).before(elmt).remove();

                return elmt;
            });
        },

        append: function (html) {
            var elmt = $(html)[0];

            return this.each(function () {
                this.appendChild(elmt);
            });
        },

        prepend: function (html) {
            var elmt = $(html)[0];

            return this.each(function () {
                this.insertBefore(elmt, this.firstChild);
            });
        },

        before: function (html) {
            var elmt = $(html)[0];

            return this.each(function () {
                this.parentNode.insertBefore(elmt, this);
            });
        },

        after: function (html) {
            var elmt = $(html)[0];

            return this.each(function () {
                this.parentNode.insertBefore(elmt, this.nextSibling);
            });
        },

        wrapWith: function (html) {
            var elmt = $(html)[0],
                last = elmt;

            return this.map(function () {
                $(this).before(elmt);

                while (last.children.length) {
                    last = last.children[0];
                }

                $(last).append(this);

                return elmt;
            });
        },

        remove: function() {
            return this.each(function () {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            });
        },

        addClass: function (key) {
            return this.each(function () {
                if (!$(this).hasClass(key)) {
                    this.className = this.className + ' ' + key;
                }
            });
        },

        removeClass: function (key) {
            return this.each(function () {
                this.className = this.className.replace(getClassRe(key), ' ');
            });
        },

        hasClass: function (key) {
            return getClassRe(key).test(this[0].className);
        },

        toggleClass: function (key) {
            return this.each(function () {
                var $elmt = $(this);

                if ($elmt.hasClass(key)) {
                    $elmt.removeClass(key);
                } else { 
                    $elmt.addClass(key);
                }
            });
        },

        css: function (key, value) {
            key = getCssProperty(key);

            if (value !== undefined) {
                key = camelize(key);

                return this.each(function () {
                    this.style[key] = value;
                });
            }

            return this[0].style[key] || getComputedStyle(this[0]).getPropertyValue(key);
        },

        on: function (name, handler, capture) {
            var e   = getEventInfo(name),
                key = e.name + '.' + e.ns;

            return this.each(function () {
                var handlerList  = this.__handlers || {};
                handlerList[key] = handlerList[key] || [];
                handlerList[key].push(handler);
                
                this.__handlers = handlerList;

                this.addEventListener(e.name, handler, capture);
            });
        },

        off: function (name, capture) {
            var e = getEventInfo(name),
                handlers;

            return this.each(function () {
                var  k, i, x;

                if (!this.__handlers) {
                    return;
                }

                handlers = this.__handlers;

                for (k in handlers) {
                    if (handlers.hasOwnProperty(k)) {
                        i = getEventInfo(k);

                        if ((e.name === '*'    
                                && (e.ns === '*' || e.ns === i.ns)) 
                         || (e.name === i.name 
                                && (e.ns === i.ns || e.ns === '*'))
                         ) {

                            for (x = 0; x < handlers[k].length; x++) {
                                this.removeEventListener(i.name, handlers[k][x], capture);
                            }

                            delete handlers[k];
                        }
                    }
                }
            });
        },

        trigger: function (name) {
            var evt = document.createEvent("HTMLEvents");

            evt.initEvent(name);
            
            return this.each(function () {
                this.dispatchEvent(evt);
            });
        }
    };

    function getEventInfo (name) {
        var splits = name.split('.');

        return {
            name: splits[0] || '*',
            ns:   splits[1] || '*'
        };
    }

    function getClassRe (className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    function getComputedStyle (elmt) {
        return window.getComputedStyle(elmt, '');
    }

    function getCssStyles () {
        return [].slice.call(getComputedStyle(document.documentElement));
    }

    function getCssPrefix () {
        var prefix = (cssStyles.join('').match(/-(moz|webkit|ms)-/) || (cssStyles.OLink === '' && ['', 'o']))[1];

        return prefix === 'ms' ? prefix : firstCap(prefix);
    }

    function getCssProperty (property) {
        var prefixed = '';

        if (cssPrefix) {
             prefixed = '-' + cssPrefix + '-' + property;
        }

        if (cssStyles.indexOf(prefixed.toLowerCase()) !== -1) {
            return prefixed;
        }

        return property;
    }

    function firstCap (string) {
        return string[0].toUpperCase() + string.substr(1);
    }

    function camelize (string) {
        return string.replace(/-+(.)?/g, function (x, chr) { 
            return chr ? chr.toUpperCase() : '';
        });
    }

    return $;
});
