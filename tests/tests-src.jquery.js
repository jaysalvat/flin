/*
Pin
Copyright (c) 2014 Jay Salvat
*/

/* global Pin:true, QUnit:true */

(function ($) {
    "use strict";

    QUnit.test('Pin', function (assert) {
        assert.ok($()._pin);
        assert.equal($().length, 0);
    });

    QUnit.test('Wrap method', function (assert) {
        var $$,
            $new,
            html = '<div id="new"><span></span></div>';

        $$ = $('#one');
        $$.wrap(html);
        $new = $('#new');
        assert.ok($new.is('div'));
        assert.ok($new.has('span'));
        assert.ok($new.has('ul#one'));
    });

    QUnit.test('Css method', function (assert) {
        var $$;

        $$ = $("#one");

        $$.css('width', '999px');
        assert.equal($$.css('width'), '999px');
    });

    QUnit.test('Class methods', function (assert) {
        var $$;

        $$ = $("#one");

        $$.addClass('foo');
        assert.equal($$.hasClass('foo'), true);

        $$.removeClass('foo');
        assert.equal($$.hasClass('foo'), false);

        $$.toggleClass('bar');
        assert.equal($$.hasClass('bar'), true);

        $$.toggleClass('bar');
        assert.equal($$.hasClass('bar'), false);

        $$.toggleClass('bar');
        assert.equal($$.hasClass('bar'), true);
    });

    QUnit.test('Attr method', function (assert) {
        var $$;

        $$ = $("#one");

        $$.attr('id', 'bar');
        assert.equal($$.attr('id'), 'bar');

        $$.removeAttr('id');
        assert.equal($$.attr('id'), undefined);
    });

    QUnit.test('Text method', function (assert) {
        var $$;

        $$ = $("#one");

        $$.text('foo');
        assert.equal($$.text(), 'foo');
    });

    QUnit.test('Html method', function (assert) {
        var $$;

        $$ = $("#one");

        $$.html('<span>ok</span>');
        assert.equal($$.html(), '<span>ok</span>');
    });

    QUnit.test('Size method', function (assert) {
        var $$;

        $$ = $("#one li");

        assert.equal($$.size(), 5);
    });

    QUnit.test('First/last methods', function (assert) {
        var $$;

        $$ = $("#one li");

        assert.ok($$.first().hasClass('item1'));
        assert.ok($$.last().hasClass('item5'));
    });

    QUnit.test('ToAray method', function (assert) {
        var $$;

        $$ = $("#one li");

        assert.equal($$._pin, true);
        assert.equal($$.length, 5);
        assert.ok(typeof $$.eq === 'function');

        $$ = $$.toArray();

        assert.equal($$._pin, undefined);
        assert.equal($$.length, 5);
        assert.ok(typeof $$.eq !== 'function');
    });

    QUnit.test('Data method', function (assert) {
        var $$;

        $$ = $("#one li");

        assert.equal($$.data('foo'), undefined);
        assert.equal($$.data('foo-bar'), undefined);

        $$.data('foo', 'bar');

        assert.equal($$.data('foo'), 'bar');

        $$.data('foo-bar', 'bar');

        assert.equal($$.data('foo-bar'), 'bar');
    });
})(Pin);
