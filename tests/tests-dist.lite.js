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

    QUnit.test('Fragment', function (assert) {
        var $$;

        $$ = $("<div><span>ok</span></div>");
        assert.equal($$[0].tagName, 'DIV');
        assert.equal($$[0].innerHTML, '<span>ok</span>');
        assert.equal($$[0].outerHTML, '<div><span>ok</span></div>');
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
})(Pin);
