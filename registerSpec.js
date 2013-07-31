describe('registration', function () {
    describe('register without a name', function () {
        it('not allowed', function () {
            var c = container();
            expect(function () {
                c.register(null, function () {
                })
            }).toThrow('Valid name is required.');
        });
    });

    describe('name with only whitespaces', function () {
        it('not allowed', function () {
            var c = container();
            expect(function () {
                c.register('  \t', function () {
                })
            }).toThrow('Valid name is required.');
        });
    });

    describe('register an anonymous function', function () {
        it('not allowed', function () {
            var c = container();
            expect(function () {
                c.register(function () {
                })
            }).toThrow('Valid name is required.');
        });
    });
});