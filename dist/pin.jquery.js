/*! Pin v0.1.5 (c) 2014 Jay Salvat http://pin.jaysalvat.com */

(function ($) {
    'use strict';
    /* jshint laxbreak: true */ 

    $.fn.wrap = function (value) {
        return this.wrapWith(value);
    };

    $.fn.css = function (key, value) {
        if (value === undefined) {
            if (typeof key === 'object') {
                var values = {};

                $.each(key, function (key, value) {
                    values[':' + key] = value;
                });

                return this.set(values);
            }
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

    $.fn.val = function (value) {
        if (value === undefined) {
            if (this[0].multiple) {
                return [].map.call(
                    elmt.querySelectorAll('option[selected'), function (option) { 
                      return option.value; 
                    }
                );
            }
            
            return this[0].value;
        }

        return this.each(function (i) {
            this.value = functionOrValue(value, this, i);
        });
    };

    $.fn.empty = function () {
        return this.each(function () {
            this.innerHTML = '';
        });
    };

    $.fn.contents = function () {
        var elmts = [];

        this.each(function () {
            elmts = elmts.concat([].slice.apply(this.childNodes));
        });

        return $($.uniq(elmts));
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

    $.fn.show = function () {
        var args = arguments;

        return this.each(function () {
            var $elmt = $(this);

            if ($elmt.get(':display') === 'none') {
                $elmt.set(':display', $elmt.data('_display') || '');
            }

            findCallbackInArgs(args).apply(this);
        });
    };

    $.fn.hide = function () {
        var args = arguments;

        return this.each(function () {
            var $elmt = $(this);

            $elmt.data('_display', $elmt.get(':display'));
            $elmt.set(':display', 'none');

            findCallbackInArgs(args).apply(this);
        });       
    };

    $.fn.toggle = function () {
        var args = arguments;
        
        return this.each(function () {
            var $elmt = $(this);

            if ($elmt.get(':display') === 'none') {
                $elmt.show();
            } else {
                $elmt.hide();
            }

            findCallbackInArgs(args).apply(this);
        });  
    };
    
    $.fn.error = function(msg) {
        throw new Error(msg);
    };

    $.fn.noop = function() {};

    [ 'fadeIn', 'slideDown', 'fadeOut', 'slideUp', 'fadeToggle', 'slideToggle', 'fadeTo' ].forEach(function (name, i) {
        if (i === 0 || i === 1) {
            $.fn[name] = function () {
                return this.show.apply(this, arguments);
            };
        }

        if (i === 2 || i === 3) {
            $.fn[name] = function () {
                return this.hide.apply(this, arguments);
            };
        }

        if (i === 4 || i === 5) {
            $.fn[name] = function () {
                return this.toggle.apply(this, arguments);
            };
        }

        $.fn[name] = function (duration, opacity) {
            if (opacity > 0.5) {
                return this.show.apply(this, arguments);    
            }
            return this.hide.apply(this, arguments);
        };
    });

    [ 'prependTo', 'appendTo', 'insertBefore', 'insertAfter' ].forEach(function (name, i) {
        $.fn[name] = function (html) {
            var method = name.toLowerCase().replace(/to|insert/, '');

            $(html)[method](this);
        };
    });

    function findCallbackInArgs (args) {
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') {
                return args[i];
            }
        }

        return function () {};
    }

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
