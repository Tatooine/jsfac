describe('define foo module importing bar and jar with hurp and durp services', function () {

    var c = jsfac.container();

    var hurp = function () {
    };

    var durp = function () {
    };

    var newModule = c.module('foo', ['bar', 'jar'], function (r) {
        r('hurp', [], hurp);
        r('durp', [], durp);
    });

    it('module name is foo', function () {
        expect(newModule.name).toBe('foo');
    });

    it('imports bar and jar', function () {
        expect(newModule.imports).toContain('bar', 'jar');
    });

    it('registers hurp and durp', function () {
        expect(newModule.find('hurp').implementation).toBe(hurp);
        expect(newModule.find('durp').implementation).toBe(durp);
    });

    describe('define foo module again importing rub with jubla and bupla services', function () {
        var jubla = function () {

        };

        var bupla = function () {

        };

        var m = c.module('foo', ['rub'], function (r) {
            r('jubla', [], jubla);
            r('bupla', [], bupla);
        });

        it('module name is foo', function () {
            expect(m.name).toBe('foo');
        });

        it('imports bar, jar and rub', function () {
            expect(newModule.imports).toContain('bar', 'jar', 'rub');
        });

        it('registers hurp, durp as well as jubla and bupla', function () {
            expect(newModule.find('hurp').implementation).toBe(hurp);
            expect(newModule.find('durp').implementation).toBe(durp);
            expect(newModule.find('jubla').implementation).toBe(jubla);
            expect(newModule.find('bupla').implementation).toBe(bupla);
        });

    });
});
