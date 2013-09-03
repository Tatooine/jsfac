describe('foo needs bar at somepoint later', function(){
	var c = jsfac.container();

	var module = c.module('m', [], function(r){
		r('bar', [], function(){
			return 'bar';		
		});

		r('foo', [{ name: 'bar', lazy: true }], function(bar){
			return bar;
		});
	});

	var foo = c.resolve('m', 'foo');

	it('should receive a function to create bar', function(){
		expect(typeof foo).toBe('function');
	});

	it('should be able to create bar by invoking the provided function', function(){
		expect(foo()).toBe('bar');
	});
});

describe('foo needs singlton hurp at somepoint later and bar needs it on creation', function(){
	
	var container = function(){
		var c = jsfac.container();

		var module = c.module('m', [], function(r){
			r('hurp', [], function(){
				var i = 0;			
				return {
					value: function(){ return i++; }	
				};		
			}, { sharingMode: 'single' });

			r('foo', [{ name: 'hurp', lazy: true }], function(hurp){
				return hurp;
			});

			r('bar', ['hurp'], function(hurp){
				return 	hurp;
			});	
		});

		return c;
	};

	describe('foo is created before bar but foo does not use hurp until later', function(){
		var c = container();
		var foo = c.resolve('m', 'foo');
		var bar = c.resolve('m', 'bar');

		it('bar should see hurp first', function(){
			expect(bar.value()).toBe(0);
		});

		it('foo should see same hurp later', function(){
			expect(foo().value()).toBe(1);
		});
	});

	describe('bar is created before foo', function(){
		var c = container();
		var bar = c.resolve('m', 'bar');
		var foo = c.resolve('m', 'foo');

		it('bar should see hurp first', function(){
			expect(bar.value()).toBe(0);
		});

		it('foo should see same hurp later', function(){
			expect(foo().value()).toBe(1);
		});
	});

	describe('foo is created and consumed hurp before bar is created', function(){
		var c = container();
		c.resolve('m', 'foo')().value();
		var bar = c.resolve('m', 'bar');

		it('bar should get same hurp given to foo', function(){
			expect(bar.value()).toBe(1);
		});
	});
});