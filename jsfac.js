var register, resolve, container;

(function () {
    var dependencyReader = function(service){
		
		var reflected = service.toString();

		var ex = /function\s*.*\s*\((\s*(.*)\s*,?[\s]*)\)/;
		var matches = ex.exec(reflected);

		var deps = [];
		var items = matches[1].split(',');

		for(var i in items){
			deps.push(items[i].trim());
		}

		return deps;
	};

	var scope = function(registry){

		var sharedInstances = {};

		var getOrCreate = function(name, registration, factory){
			
			if(registration.options.sharingMode !== 'single'){
				return factory();
			}

			if(typeof sharedInstances[name] != 'undefined')
				return sharedInstances[name];

			sharedInstances[name] = factory();
			return sharedInstances[name];
		};

		var resolveCore = function(name, pending){
			if(pending[name])
				throw 'Cyclic dependency detected.';

			var r = registry[name];
			
			if(!r) return r;

			if(r.dependencies.length == 0)
				getOrCreate(name, r, r.implementation);

			pending[name] = true;
			
			var deps = [];
			
			for(var dep in r.dependencies){
				deps.push(resolveCore(r.dependencies[dep], pending));
			}

			var service = getOrCreate(name, r, function(){
				return r.implementation.apply(null, deps);	
			}); 
		
			pending[name] = false;

			return service;
		};

		return {
			resolve: function(name){
				return resolveCore(name, {});
			}
		};
	};

	container = function(){

		var registry = {};
		var rootScope = scope(registry);

		return {
			register: function(name, implementation, options){
				if(!implementation)
					return registry[name].implementation;

				registry[name] = {
					dependencies: dependencyReader(implementation),
					implementation: implementation,
					options: options || {}
				};
			},

			resolve: function(name){
				return rootScope.resolve(name);
			}
		};
		
	};

	container.dependencyReader = dependencyReader;

	var c = container();

	register = c.register;
	resolve = c.resolve;

})(this); 