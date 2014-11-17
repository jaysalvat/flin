
(function (context, factory) {
    'use strict';
    /* globals define: true, module: true */

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        context.Pin = factory();

        if (context.$ === undefined) {
            context.$ = context.Pin;
        }
    }
})(this, function () {
    'use strict';
    /* jshint laxbreak: true */ 

    var $,
        pin   = {}, 
        div   = document.createElement('div'),
        table = document.createElement('table'), 
        tbody = document.createElement('tbody'),
        tr    = document.createElement('tr'),
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

    /* extended-code */
    var cssStyles = getCssStyles(),
        cssPrefix = getCssPrefix();
    /* end-extended-code */

    pin.init = function (selector, context) {
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

    pin.Collection = function (elmts) {
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
            value;

        $(elmts).each(function (i) {
            value = callback.call(this, this, i);

            if (value !== null) {
                values.push(value);
            }
        });

        return values;
    };
    
    /* extended-code */
    $.uniq = function (elmts) {
        return [].filter.call(elmts, function (elmt, idx) { 
            return elmts.indexOf(elmt) === idx;
        });
    };

    $.extend = function (deep) {
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
    /* end-extended-code */

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
            } else if (this.length === 1) {
                elmts = this[0].querySelectorAll(selector);
            } else {
                elmts = this.map(function () { 
                    return this.querySelectorAll(selector);
                });
            }
            
            return $(elmts);
        },

        /* extended-code */
        slice: function () {
            return $([].slice.apply(this, arguments));
        },

        parent: function (selector) {
            return this.parents(selector, true);
        },

        closest: function (selector) {
            return $.uniq(this.map(function () {
                if ($(this).is(selector)) {
                    return this;
                }

                return $(this).parent(selector)[0];    
            }));
        },

        parents: function (selector, firstOnly){
            var elmts   = this,
                parents = [],
                parent;

            if (typeof selector === 'boolean')  {
                firstOnly = selector;
                selector  = null;
            }

            function findParents (elmts) {
                return $.map(elmts, function () {
                    parent = this.parentNode;

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

                if (firstOnly && parents.length) {
                    return $(parents);
                }
            }

            return $(parents);
        },
        
        eq: function (idx) {
            return this.slice(idx, idx + 1);
        },

        index: function (elmt) {
            if (elmt) {
                return this.indexOf($(elmt)[0]);
            }

            return this.parent.childNodes.indexOf(this[0]);
        },

        has: function (selector) {
            return !!this.find(selector).length;
        },

        is: function (selector) {
            return !!(this.map(function () {
                if (this !== selector && !(
                    this.webkitMatchesSelector
                    || this.mozMatchesSelector
                    || this.msMatchesSelector
                    || this.oMatchesSelector
                    || this.matchesSelector
                ).call(this, selector)) {
                    return null;
                }
            })).length;
        },

        replaceWith: function (html) {
            var elmt = $(html)[0];

            return this.map(function () {
                $(this).before(elmt).remove();

                return elmt;
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

        remove: function () {
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
                this.className = this.className.replace(getClassRe(key), '');
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
            var evt = getEventInfo(name),
                key = evt.name + '.' + evt.ns,
                handlerList,
                handlerProxy,
                args;

            return this.each(function () {
                handlerProxy = function (e) {
                    args = e._args || [];
                    args.unshift(e);

                    handler.apply(this, args);
                };

                handlerList = this._handlers || {};
                handlerList[key] = handlerList[key] || [];
                handlerList[key].push(handlerProxy);
                
                this._handlers = handlerList;
                this.addEventListener(evt.name, handlerProxy, capture);
            });
        },

        off: function (name, capture) {
            var evt = getEventInfo(name);

            return this.each(function () {
                var k, i, x,
                    handlers;

                handlers = this._handlers;

                for (k in handlers) {
                    if (handlers.hasOwnProperty(k)) {
                        i = getEventInfo(k);

                        if ((evt.name === '*' || evt.name === i.name ) && (evt.ns === '*' || evt.ns === i.ns)) {

                            for (x = 0; x < handlers[k].length; x++) {
                                this.removeEventListener(i.name, handlers[k][x], capture);
                            }

                            delete handlers[k];
                        }
                    }
                }
            });
        },

        trigger: function (name, args) {
            var evt = document.createEvent('HTMLEvents');

            evt.initEvent(name, true, true);
            evt._args = args;

            return this.each(function () {
                this.dispatchEvent(evt);
            });
        },

        set: function (key, value) {
            return this.each(function (i) {
                var sign = key[0],
                    unsignedKey = key.slice(1);

                value = (typeof value === 'function') ? value.call(this, i) : value;

                if (sign === '@') {
                    if (value === undefined) {
                        this.removeAttribute(unsignedKey);
                    } else {
                        this.setAttribute(unsignedKey, value);
                    }
                }

                if (sign === '.') {
                    if (value === null) {
                        this.removeClass(unsignedKey);
                    } else {
                        this.addClass(unsignedKey);
                    }
                }

                if (sign === '=') {
                    this.css(unsignedKey, value);
                }

                this[key] = value;
            });
        },

        get: function (key) {
            var that = this[0],
                sign = key[0],
                unsignedKey = key.slice(1);

            if (sign === '@') {
                return that.getAttribute(unsignedKey);
            }

            if (sign === '.') {
                return that.hasClass(unsignedKey);
            }

            if (sign === '=') {
                return that.css(unsignedKey);
            }

            return that[key]; 
        }
        /* end-extended-code */
    };

    /* extended-code */
    [ 'prepend', 'append', 'before', 'after' ].forEach(function (name, i) {
        $.fn[name] = function (html) {
            var elmt = $(html)[0];

            return this.each(function () {
                if (i === 0) {
                    return this.insertBefore(elmt, this.firstChild);   
                }

                if (i === 1) {
                    return this.appendChild(elmt);
                }

                if (i === 2) {
                    return this.parentNode.insertBefore(elmt, this);
                }

                return this.parentNode.insertBefore(elmt, this.nextSibling);
            });
        };
    });

    function getEventInfo (name) {
        var splits = name.split('.');

        return {
            name: splits[0] || '*',
            ns:   splits[1] || '*'
        };
    }

    function getClassRe (className) {
        return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
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
    /* end-extended-code */

    return $;
});
