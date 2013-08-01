describe('dependency scenarios', function () {
    describe('a in module m needs nothing', function () {

        var c = jsfac.container();
        c.module('m', [], function (register) {
            register('a', [], function () {
                return 'foo';
            });
        });

        it('should create a', function () {
            expect(c.resolve('m', 'a')).toBe('foo');
        });
    });

    describe('m.a needs m.b', function () {

        var c = jsfac.container();
        c.module('m', [], function (register) {
            register('a', ['b'], function (b) {
                return {b: b};
            });

            register('b', [], function () {
                return 'foo';
            });
        });

        it('m.a is given to m.b', function () {
            expect(c.resolve('m', 'a').b).toBe('foo');
        });
    });

    describe('m.a needs m.b and m.c. m.b needs m.c.', function () {

        var c = jsfac.container();

        c.module('m', [], function (register) {

            register('c', [], function () {
                return {value: "cvalue"};
            });
            register('b', ['c'], function (c) {
                return { c: c };
            });

            register('a', ['b', 'c'], function (b, c) {
                return {
                    b: b,
                    c: c
                };
            });

        });

        var a = c.resolve('m', 'a');

        it('a gets c', function () {
            expect(a.c.value).toBe('cvalue');
        });

        it('a gets b with c', function () {
            expect(a.b.c.value).toBe('cvalue');
        });

        it('a\'s c and b\'s c are not the same', function () {
            expect(a.c).toNotBe(a.b.c);
        });
    });

    describe('m.a needs m.b but m.b needs m.a', function () {

        var c = jsfac.container();

        c.module('m', [], function (register) {

            register('a', ['b'], function (b) {
            });
            register('b', ['a'], function (a) {
            });

        });


        var r = function () {
            c.resolve('m', 'a');
        };

        it('throws an exception', function () {
            expect(r).toThrow('Cyclic dependency detected.');
        });
    });

    describe('m-a needs m-b, m-b needs m-c. m-c also needs m-a', function () {

        var c = jsfac.container();

        c.module('m', [], function (register) {

            register('a', ['b'], function (b) {
            });
            register('b', ['c'], function (c) {
            });
            register('c', ['a'], function (a) {
            });

        })


        it('throws an exception due to indirect cycle', function () {
            expect(function () {
                c.resolve('m', 'a')
            }).toThrow('Cyclic dependency detected.');
        });
    });
});