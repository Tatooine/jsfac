describe('instance scoping', function () {
    describe('m-a and m-b both need the same instance of m-c', function () {
        it('both should be given same m.c', function () {
            var c = jsfac.container();
            var i = 0;

            c.module('m', [], function (register) {

                register('a', ['c'], function (c) {
                    return {
                        c: c
                    };
                });

                register('b', ['c'], function (c) {
                    return {
                        c: c
                    };
                });

                register('c', [], function () {
                    return i++;
                }, { sharingMode: 'single' });

            });

            var a = c.resolve('m', 'a');
            var b = c.resolve('m', 'b');

            expect(a.c).toBe(b.c);
        });
    });
});
