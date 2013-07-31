describe('instance scoping', function () {
    describe('a and b both need the same instance of c', function () {
        it('both should be given same c', function () {
            var c = container();
            var i = 0;

            c.register('a', function (c) {
                return {
                    c: c
                };
            });

            c.register('b', function (c) {
                return {
                    c: c
                };
            });

            c.register('c', function () {
                return i++;
            }, { sharingMode: 'single' });

            var a = c.resolve('a');
            var b = c.resolve('b');

            expect(a.c).toBe(b.c);
        });
    });
});
