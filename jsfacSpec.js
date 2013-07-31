describe('dependency scenarios', function(){
    describe('a needs nothing', function(){

        var c = container();

        it('should create a', function(){
            c.register('a', function(){
                return 'foo';
            });
            expect(c.resolve('a')).toBe('foo');
        });
    });

    describe('a needs b', function(){

        var c = container();

        it('a gets b', function(){

            c.register('b', function(){ return 'foo'; });
            c.register('a', function(b){ return { b: b}; })

            expect(c.resolve('a').b).toBe('foo');
        });
    });

    describe('a needs b and c. b needs c.', function(){

        var c = container();

        c.register('c', function(){ return {value: "cvalue"}; });
        c.register('b', function(c){ return { c: c }; });

        c.register('a', function(b, c){
            return {
                b: b,
                c: c
            };
        });

        var a = c.resolve('a');

        it('a gets c', function(){
            expect(a.c.value).toBe('cvalue');
        });

        it('a gets b with c', function(){
            expect(a.b.c.value).toBe('cvalue');
        });

        it('a\'s c and b\'s c are not the same', function(){
            expect(a.c).toNotBe(a.b.c);
        });
    });

    describe('a needs b but b needs a', function(){

        var c = container();

        c.register('a', function(b){});
        c.register('b', function(a){});

        var r = function(){
            c.resolve('a');
        };

        it('throws an exception', function(){
            expect(r).toThrow('Cyclic dependency detected.');
        });
    });

    describe('a needs b, b needs c. c also needs a', function(){

        var c = container();

        c.register('a', function(b) {});
        c.register('b', function(c) {});
        c.register('c', function(a) {});

        it('throws an exception due to indirect cycle', function(){
            expect(function() { c.resolve('a')}).toThrow('Cyclic dependency detected.');
        });
    });
});