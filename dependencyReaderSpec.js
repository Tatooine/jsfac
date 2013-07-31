describe('dependency reader', function(){
    describe('anonymous function requires a and b', function(){

        it('reads a and b', function(){
            expect(container.dependencyReader(function(a, b){
            })).toContain('a', 'b');
        });

    });

    describe('named function requires a and b', function(){

        function foo(a, b){
        }

        it('reads a and b', function(){
            expect(container.dependencyReader(foo)).toContain('a', 'b');
        });
    });

    describe('function definition with whitespace between argument ids', function(){
        it('reads arguments without whitespace', function(){
            expect(container.dependencyReader(function(alpha , 	beta	 	){
            })).toContain('alpha', 'beta');
        });
    });
});

