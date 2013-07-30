describe('a needs nothing', function(){
	
	var c = container();

	it('should create a', function(){
		c.register('a', [], function(){
			return 'foo';
		});		
		expect(c.resolve('a')).toBe('foo');
	});
});

describe('a needs b', function(){

	var c = container();

	it('a gets b', function(){

		c.register('b', [], function(){ return 'foo'; });

		c.register('a', ['b'], function(d){ return { received: d}; })

		expect(c.resolve('a').received).toBe('foo');
	});
});

describe('a needs b and c. b also needs c.', function(){
	
	var c = container();

	c.register('c', [], function(){ return "cvalue"; });

	c.register('b', ['c'], function(c){ return { c: c }; });

	c.register('a', ['b', 'c'], function(b, c){
		return {
			b: b,
			c: c
		};
	});

	var a = c.resolve('a');

	it('a gets c', function(){
		expect(a.c).toBe('cvalue');
	});

	it('a gets b with c', function(){
		expect(a.b.c).toBe('cvalue');
	});
});

describe('a needs b but b needs a', function(){

	var c = container();

	c.register('a', ['b'], function(b){});

	c.register('b', ['a'], function(a){});

	var r = function(){
		c.resolve('a');
	};

	it('throws an exception', function(){
		expect(r).toThrow('Cyclic dependency detected.');
	});
});

describe('a needs b, b needs c but c also needs a', function(){
	
	var c = container();

	c.register('a', ['b'], function(b) {});
	c.register('b', ['c'], function(c) {});
	c.register('c', ['a'], function(a) {});

	it('throws an exception due to indirect cycle', function(){
		expect(function() { c.resolve('a')}).toThrow('Cyclic dependency detected.');
	});
});
