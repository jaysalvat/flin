Flin. A tiny Javascript library.
================================

A taste of jQuery without the fat.

[![Build Status](https://travis-ci.org/jaysalvat/flin.png?branch=master)](https://travis-ci.org/jaysalvat/flin)
[![Bower version](https://badge.fury.io/bo/flin.svg)](http://badge.fury.io/bo/flin)

Flin is a tiny AMD-ready Javascript library (~1,5Kb minified, ~900 bytes GZIPed) bringing some jQuery sugar 
to your vanilla javascript developments such as selectors, iterations, DOM element creation and plugins.

     npm install flin

Or the [bower](http://bower.io) way.

     bower install flin

Examples
--------

Some examples.

### Selectors

```javascript
$('.example').each(function () {
    this.style.display = 'none';
});
```

### Element creation with HTML

```javascript
$('<h1>Example</h1><div class="example"></div>').each(function () {
    document.body.appendChild(this);
});
```

### Plugin

```javascript
$.fn.hide = function () {
    return this.each(function () {
        this.style.display = 'none';
    });
};

$('.example').hide();
```

### DOM loaded

```javascript
$(function () {
    alert('The DOM is loaded.');
});
```

Flin extended
-------------

The extended version of Flin (~5.5Kb minified, ~2.5kb GZIPed) provides some extra DOM traversing, DOM/classes/styles 
manipulation, and namespaced Events methods.

A better documentation coming soon...

- $.extend()
- $.uniq()
- $.each()
- $('elmts').width()
- $('elmts').height()
- $('elmts').outerWidth()
- $('elmts').outerHeight()
- $('elmts').find()
- $('elmts').each()
- $('elmts').slice()
- $('elmt').parent()
- $('elmt').parents()
- $('elmt').children()
- $('elmt').closest()
- $('elmt').eq()
- $('elmt').index()
- $('elmt').has()
- $('elmt').is()
- $('elmt').append()
- $('elmt').prepend()
- $('elmt').before()
- $('elmt').after()
- $('elmt').wrap()
- $('elmt').replace()
- $('elmt').on()
- $('elmt').off()
- $('elmt').trigger()
- $('elmt').set('.classname')
- $('elmt').set('.classname', 'remove')
- $('elmt').set('.classname', 'toggle')
- $('elmt').get('.classname')
- $('elmt').set('@src', '');
- $('elmt').get('@src')
- $('elmt').set(':color', 'red')
- $('elmt').get(':Color')

No Ajax methods planned.

**Important Note:** 
Even if the extended Flin API is near jQuery API, its goal is ABSOLUTELY NOT to be compatible.

## Compatibility

Unit tests turn green on IE9+, Chrome 30+, Firefox 30+, Opera 20+, Safari 5+ 
that should makes it a great choice for most modern apps, mobile or not.

The MIT License (MIT)
---------------------

Copyright 2015 Jay Salvat

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

