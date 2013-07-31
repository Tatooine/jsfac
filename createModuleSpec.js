describe('create foo module importing bar and jar with hurp and durp services', function () {

    var hurp = function () {
    };

    var durp = function () {
    };

    var newModule = container.module('foo', ['bar', 'jar'], function (r) {
        r('hurp', hurp);
        r('durp', durp);
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
});