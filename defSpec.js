describe('module jibber with jabber service', function () {
    var c = jsfac.container();
    var jabber = function () {
    };

    c.module('jibber', [], function (register) {
        register('jabber', [], jabber);
    });

    it('can get the def of jabber', function () {
        expect(c.def('jibber', 'jabber')).toBe(jabber);
    });

    it('cannot get the def of durb service', function () {
        expect(c.def('jibber', 'durb')).toBeFalsy();
    });

    it('cannot get the def of jabber in burp module', function () {
        expect(c.def('burp', 'jabber')).toBeFalsy();
    })
});