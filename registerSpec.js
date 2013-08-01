describe('registration', function () {
    var m;

    beforeEach(function () {
        m = jsfac.container().module('m', [], function () {
        });
    });

    describe('register without a name', function () {

        var m = container().module('m', [], function () {
        });

        it('not allowed', function () {
            expect(function () {
                m.register(null, [], function () {
                })
            }).toThrow('Valid name is required.');
        });
    });

    describe('name with only whitespaces', function () {
        it('not allowed', function () {
            expect(function () {
                m.register('  \t', [], function () {
                })
            }).toThrow('Valid name is required.');
        });
    });

    describe('register an anonymous function', function () {
        it('not allowed', function () {
            expect(function () {
                m.register(function () {
                })
            }).toThrow('Valid name is required.');
        });
    });
});