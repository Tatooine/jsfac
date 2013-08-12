describe('debugging', function () {
    describe('m1-a needs m2-b', function () {
        var c = jsfac.container();
        c.module('m1', ['m2'], function (register) {
            register('a', ['b'], function () {
                
            });
        })

        c.module('m2', [], function(register){
            register('b', [], function(){

            });
        });

        it('should get dependency graph for m1-a', function () {
            var m = c.debug.resolve('m1', 'a');

            expect(m.module).toBe('m1');
            expect(m.name).toBe('a');
            expect(m.deps.length).toBe(1);
            expect(m.deps[0].module).toBe('m2');
            expect(m.deps[0].name).toBe('b');
        });

        it('should get graph for m1-a and m2-b', function(){
            var g = c.debug.graph();
            var names = [g[0].name, g[1].name];
            expect(g.length).toBe(2);
            expect(names).toContain('a');
            expect(names).toContain('b');
        });
    });
});
