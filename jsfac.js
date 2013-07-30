var register, resolve, container;

(function(global){
	
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

	container = function(){

		var registry = {};

		var resolveCore = function(name, pending){
			if(pending[name])
				throw 'Cyclic dependency detected.';

			var r = registry[name];
			
			if(!r) return r;

			if(r.dependencies.length == 0)
				return r.implementation();

			pending[name] = true;
			
			var deps = [];
			
			for(var dep in r.dependencies){
				deps.push(resolveCore(r.dependencies[dep], pending));
			}

			var service = r.implementation.apply(null, deps);

			pending[name] = false;

			return service;
		};

		return {
			register: function(name, implementation){
				if(!implementation)
					return registry[name].implementation;

				registry[name] = {
					dependencies: dependencyReader(implementation),
					implementation: implementation
				};
			},

			resolve: function(name){
				return resolveCore(name, {});
			}
		};
		
	};

	container.dependencyReader = dependencyReader;

	var c = container();

	register = c.register;
	resolve = c.resolve;

})(this); 