var register, resolve, container, module;

(function () {
    var _utils = {
        isNullOrWhitespace: function (string) {
            return !string ? true : !/\S/.test(string);
        }
    };

    var _dependencyReader = function (service) {

        var reflected = service.toString();

        var ex = /function\s*.*\s*\((\s*(.*)\s*,?[\s]*)\)/;
        var matches = ex.exec(reflected);

        var deps = [];
        var items = matches[1].split(',');

        for (var i in items) {
            deps.push(items[i].trim());
        }

        return deps;
    };

    var _scope = function (registry) {

        var sharedInstances = {};

        var getOrCreate = function (name, registration, factory) {

            if (registration.options.sharingMode !== 'single') {
                return factory();
            }

            if (typeof sharedInstances[name] != 'undefined')
                return sharedInstances[name];

            sharedInstances[name] = factory();
            return sharedInstances[name];
        };

        var resolveCore = function (name, pending) {
            if (pending[name])
                throw 'Cyclic dependency detected.';

            var r = registry[name];

            if (!r) return r;

            if (r.dependencies.length == 0)
                getOrCreate(name, r, r.implementation);

            pending[name] = true;

            var deps = [];

            for (var dep in r.dependencies) {
                deps.push(resolveCore(r.dependencies[dep], pending));
            }

            var service = getOrCreate(name, r, function () {
                return r.implementation.apply(null, deps);
            });

            pending[name] = false;

            return service;
        };

        return {
            resolve: function (name) {
                return resolveCore(name, {});
            }
        };
    };

    var _createModule = function (name, imports, initialization) {
        var _registry = {};

        var _register = function (name, implementation, options) {
            if (typeof name !== typeof "string")
                throw 'Valid name is required.';

            if (_utils.isNullOrWhitespace(name))
                throw 'Valid name is required.';

            if (!implementation)
                return _registry[name].implementation;

            _registry[name] = {
                dependencies: _dependencyReader(implementation),
                implementation: implementation,
                options: options || {}
            };
        };

        initialization(_register);

        return {
            name: name,
            imports: imports,
            find: function(service){
                return _registry[service];
            }
        };
    };

    container = function () {

        var registry = {};
        var rootScope = _scope(registry);

        return {
            register: function (name, implementation, options) {
                if (typeof name !== typeof "string")
                    throw 'Valid name is required.';

                if (_utils.isNullOrWhitespace(name))
                    throw 'Valid name is required.';

                if (!implementation)
                    return registry[name].implementation;

                registry[name] = {
                    dependencies: _dependencyReader(implementation),
                    implementation: implementation,
                    options: options || {}
                };
            },

            resolve: function (name) {
                return rootScope.resolve(name);
            }
        };

    };

    container.dependencyReader = _dependencyReader;
    container.module = _createModule;

    var c = container();

    register = c.register;
    resolve = c.resolve;

})();