/*
Flin
Copyright (c) 2014 Jay Salvat
*/

/* global Flin:true, QUnit:true */

(function ($) {
    "use strict";

    QUnit.test('Flin', function (assert) {
        assert.ok($()._flin);
        assert.equal($().length, 0);
    });

    QUnit.test('Selectors', function (assert) {
        var $$;

        $$ = $("#one");
        assert.equal($$.length, 1);

        $$ = $(".item1");
        assert.equal($$.length, 2);

        $$ = $('#container li');
        assert.equal($$.length, 7);

        $$ = $("li", '#container');
        assert.equal($$.length, 7);

        $$ = $($$);
        assert.equal($$.length, 7);

        $$ = $("li", '#one');
        assert.ok($$[0].textContent = 'item1-1');

        $$ = $("li", '#two');
        assert.ok($$[0].textContent = 'item2-1');

        $$ = $("li", $('#one'));
        assert.ok($$[0].textContent = 'item1-1');

        $$ = $("li", document.getElementById('one'));
        assert.ok($$[0].textContent = 'item1-1');
    });

    QUnit.test('Find', function (assert) {
        var $$;

        $$ = $('#one').find('a');
        assert.equal($$.length, 5);

        $$ = $('#two').find('a');
        assert.equal($$.length, 2);

        $$ = $('#container').find('li a');
        assert.equal($$.length, 7);
    });

    QUnit.test('Parents', function (assert) {
        var $$;

        $$ = $('#one li').parents();
        assert.equal($$.length, 5);
        assert.ok($$.is('ul'));
        assert.ok($$.is('div'));

        $$ = $('li').parents('ul');
        assert.equal($$.length, 2);
        assert.ok($$.is('ul#one'));
        assert.ok($$.is('ul#two'));
        assert.ok(!$$.is('div'));

        $$ = $('#one li').parents(true);
        assert.equal($$.length, 1);
        assert.ok($$.is('ul'));
        assert.ok(!$$.is('div'));

        $$ = $('#one li, #two li').parents(true);
        assert.equal($$.length, 2);
        assert.ok($$.is('ul#one'));
        assert.ok($$.is('ul#two'));
        assert.ok(!$$.is('div'));

        $$ = $('#one li, #two li').parents('div', true);
        assert.equal($$.length, 1);
        assert.ok(!$$.is('ul#one'));
        assert.ok($$.is('div'));
    });

    QUnit.test('Children', function (assert) {
        var $$ = $('#container'),
            $children;

        $children = $$.children();
        assert.equal($children.length, 3);

        $children = $$.children('ul');
        assert.equal($children.length, 2);

        $children = $$.children('#two');
        assert.equal($children.length, 1);
    });

    QUnit.test('Fragment', function (assert) {
        var $$;

        $$ = $("<div><span>ok</span></div>");
        assert.ok($$.is('div'));
        assert.ok($$.has('span'));
        assert.ok(!$$.has('div'));
        assert.equal($$[0].innerHTML, '<span>ok</span>');
        assert.equal($$[0].outerHTML, '<div><span>ok</span></div>');
    });

    QUnit.test('Is', function (assert) {
        var $$;

        $$ = $("#one");
        assert.ok(document.getElementById('one'));
        assert.ok($$.is('ul'));
        assert.ok(!$$.is('div'));

        $$ = $(".item1");
        assert.ok($$.is('li'));
        assert.ok(!$$.is('div'));

        $$ = $("li", '#container');
        assert.ok($$.is('li'));
        assert.ok(!$$.is('div'));

        $$ = $($$);
        assert.ok($$.is('li'));
        assert.ok(!$$.is('div'));
    });

    QUnit.test('Has', function (assert) {
        var $$;

        $$ = $('#one');
        assert.ok($$.has('li'));
        assert.ok($$.has('a'));
        assert.ok(!$$.has('div'));

        $$ = $('#two');
        assert.ok($$.has('li'));
        assert.ok($$.has('a'));
        assert.ok(!$$.has('div'));

        $$ = $('#container');
        assert.ok($$.has('li'));
        assert.ok($$.has('a'));
        assert.ok(!$$.has('table'));
    });

    QUnit.test('Eq', function (assert) {
        var $$;

        $$ = $('#container li');
        assert.equal($$.eq(0)[0].textContent, 'item 1-1');
        assert.equal($$.eq($$.length - 1)[0].textContent, 'item 2-2');

        $$ = $('#one li');
        assert.equal($$.eq(0)[0].textContent, 'item 1-1');
        assert.equal($$.eq($$.length - 1)[0].textContent, 'item 1-5');

        $$ = $('#two li');
        assert.equal($$.eq(0)[0].textContent, 'item 2-1');
        assert.equal($$.eq($$.length - 1)[0].textContent, 'item 2-2');
    });

    QUnit.test('Index', function (assert) {
        var $$;

        $$  = $('#container li');
        assert.equal($$.index($$.eq(1)), 1);
        assert.equal($$.index($$.eq(2)), 2);
        assert.equal($$.index($$.eq(100)), -1);
    });

    QUnit.test('Each', function (assert) {
        var $$,
            x = 0;

        $$ = $('#one li');

        $$.each(function (i, elmt) {
            assert.equal(elmt,  this);
            assert.equal($$[i], this);
            assert.equal(i, x++);
        });
        assert.expect(15);
    });

    QUnit.test('Slice', function (assert) {
        var $$;

        $$ = $('#container li').slice(2);
        assert.equal($$.length, 5);
        assert.equal($$.eq(0)[0].textContent, 'item 1-3');
        assert.equal($$.eq($$.length - 1)[0].textContent, 'item 2-2');

        $$ = $('#container li').slice(2, 4);
        assert.equal($$.length, 2);
        assert.equal($$.eq(0)[0].textContent, 'item 1-3');
        assert.equal($$.eq($$.length - 1)[0].textContent, 'item 1-4');
    });

    QUnit.test('DOM remove', function (assert) {
        var $$;

        $$ = $('#one li');
        assert.equal($$.length, 5);

        $$ = $('#one li');

        for (var i = $$.length; i >= 0; --i) {
            $$.eq(i).remove();
            assert.equal($('#one li').length, i);
        }
    });

    QUnit.test('DOM append/prepend', function (assert) {
        var $$;

        $$ = $('#one');
        assert.equal($$.find('li').length, 5);

        $$.prepend('<li>prepend</li>');
        assert.equal($$.find('li').length, 6);
        assert.equal($$.find('li')[0].textContent, 'prepend');

        $$.append('<li>append</li>');
        assert.equal($$.find('li').length, 7);
        assert.equal($$.find('li')[6].textContent, 'append');
    });

    QUnit.test('DOM before/after', function (assert) {
        var $$,
            $h2,
            $p;

        $$ = $('#one');

        $h2 = $('<h2>one</h2>');
        $$.before($h2);
        assert.ok($h2.is($$[0].previousSibling));

        $p = $('<p>one</p>');
        $$.after($p);
        assert.ok($p.is($$[0].nextSibling));
    });

    QUnit.test('DOM replace ', function (assert) {
        var $$,
            $new,
            html = '<div id="new"><span>ok</span></div>';

        $$ = $('#one');
        $$.replace (html);
        $new = $('#new');
        assert.equal($new[0].outerHTML, html);

        $$ = $('#two');
        $$.replace ($(html).set('@id', 'new2'));
        $new = $('#new2').set('@id', 'new');
        assert.equal($new[0].outerHTML, html);
    });

    QUnit.test('DOM wrap ', function (assert) {
        var $$,
            $new,
            html = '<div id="new"><span></span></div>';

        $$ = $('#one');
        $$.wrap (html);
        $new = $('#new');
        assert.ok($new.is('div'));
        assert.ok($new.has('span'));
        assert.ok($new.has('ul#one'));
    });

    QUnit.test('Events', function (assert) {
        var $$, foo, bar, baz;

        $$ = $('li').eq(0);

        // On

        function resetEvents ($$) {
            foo = 0;
            bar = 0;
            baz = 0;

            $$.off('*.*');

            $$.on('foo', function () {
                foo++;
            });
            $$.on('foo.ns1', function () {
                foo++;
            });
            $$.on('foo.ns2', function () {
                foo++;
            });

            $$.on('bar', function () {
                bar++;
            });
            $$.on('bar.ns1', function () {
                bar++;
            });
            $$.on('bar.ns2', function () {
                bar++;
            });

            $$.on('baz', function (e, a, b) {
                baz = a + b;
            });
        }

        // Trigger

        resetEvents($$);
        $$.trigger('foo');
        assert.equal(foo, 3);
        assert.equal(bar, 0);

        resetEvents($$);
        $$.trigger('bar');
        assert.equal(foo, 0);
        assert.equal(bar, 3);

        resetEvents($$);
        $$.trigger('bar');
        $$.trigger('bar');
        $$.trigger('bar');
        assert.equal(foo, 0);
        assert.equal(bar, 9);

        // Off

        resetEvents($$);
        $$.off('.ns1');
        $$.trigger('foo');
        assert.equal(foo, 2);  
        assert.equal(bar, 0);  

        resetEvents($$);
        $$.off('*.ns2');
        $$.trigger('foo');
        $$.trigger('bar');
        assert.equal(foo, 2);  
        assert.equal(bar, 2);  

        resetEvents($$);
        $$.off('foo');
        $$.trigger('foo');
        $$.trigger('bar');
        assert.equal(foo, 0);  
        assert.equal(bar, 3); 

        resetEvents($$);
        $$.off('foo.*');
        $$.trigger('foo');
        $$.trigger('bar');
        assert.equal(foo, 0);  
        assert.equal(bar, 3); 

        resetEvents($$);
        $$.off('*');
        $$.trigger('foo');
        $$.trigger('bar');
        assert.equal(foo, 0);
        assert.equal(bar, 0);

        resetEvents($$);
        assert.equal(baz, 0);
        $$.trigger('baz', [ 10, 20 ]);
        assert.equal(baz, 30);
        $$.trigger('baz', [ 50, 50 ]);
        assert.equal(baz, 100);
    });

    QUnit.test('Extend', function (assert) {
        var obj1 = {
            'a': 1,
            'b': 2,
            'c': {
                'c1': 1,
                'c2': 2
            }
        },
        obj2 = {
            'a': 10,
            'b': 20,
            'c': {
                'c1': 10
            }
        },
        obj3 = {
            'd': 4
        },
        obj;

        obj = $.extend(obj1, obj2, obj3);
        assert.deepEqual(obj, {
            'a': 10,
            'b': 20,
            'c': {
                'c1': 10
            },
            'd': 4
        });

        obj = $.extend(true, obj1, obj2, obj3);
        assert.deepEqual(obj, {
            'a': 10,
            'b': 20,
            'c': {
                'c1': 10,
                'c2': 2
            },
            'd': 4
        });
    });

    QUnit.test('Set / Get', function (assert) {
        var $$;

        $$ = $("#one");

        $$.set('innerText', 'foo');
        assert.equal($$.get('innerText'), 'foo');

        $$.set('@id', 'bar');
        assert.equal($$.get('@id'), 'bar');

        $$.set('@id');
        assert.equal($$.get('@id'), undefined);

        $$.set('.foo');
        assert.equal($$.get('.foo'), true);

        $$.set('.foo', 'remove');
        assert.equal($$.get('.foo'), false);

        $$.set('.bar', 'toggle');
        assert.equal($$.get('.bar'), true);

        $$.set('.bar', 'toggle');
        assert.equal($$.get('.bar'), false);

        $$.set('.bar', 'toggle');
        assert.equal($$.get('.bar'), true);

        $$.set(':width', '999px');
        assert.equal($$.get(':width'), '999px');

        $$ = $('#two li');
        assert.ok($($$.get(0)).is('.item1'));
        assert.ok($($$.get(1)).is('.item2'));
        assert.ok($($$.get(-1)).is('.item2'));
        assert.equal($$.get().length, 2);
    });

    QUnit.test('Width / Height', function (assert) {
        var $$;

        $$ = $("#three div");

        $('#three').set(':width', '100px');
        assert.equal($$.width(), 100);

        $$.width(100);
        assert.equal($$.width(), 100);
        assert.equal($$.get(':width'), '100px');

        $$.width(200);
        assert.equal($$.width(), 200);
        assert.equal($$.outerWidth(), 200);
        assert.equal($$.get(':width'), '200px');

        $$.set(':padding', '0 10px');        
        assert.equal($$.width(), 200);
        assert.equal($$.outerWidth(), 220);
        assert.equal($$.get(':width'), '200px');

        $$.height(100);
        assert.equal($$.height(), 100);
        assert.equal($$.get(':height'), '100px');

        $$.height(200);
        assert.equal($$.height(), 200);
        assert.equal($$.outerHeight(), 200);
        assert.equal($$.get(':height'), '200px');

        $$.set(':padding', '10px 0');        
        assert.equal($$.height(), 200);
        assert.equal($$.outerHeight(), 220);
        assert.equal($$.get(':height'), '200px');
    });
})(Flin);
