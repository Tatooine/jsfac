var jsfac = (function (self) {
    var _utils = {
        isNullOrWhitespace: function (string) {
            return !string ? true : !/\S/.test(string);
        },
        undefined: function () {
            return;
        }
    };

    var _scope = function (modules) {

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

        var _fqsn = function (module, service) {
            return module.name + '-' + service;
        };

        var _findRegistration = function (module, service) {

            var r = {
                module: module,
                match: module.find(service)
            };

            for (var i in module.imports) {

                var imported = modules[module.imports[i]] || {};
                var next = imported.find(service);

                if (!next) continue;

                if (r.match)
                    throw 'An ambiguous resolution';

                r.module = imported;
                r.match = next;
            }

            return r;
        };

        var resolveCore = function (module, service, pending) {

            var ctx = _findRegistration(module, service);
            if (!ctx.match) return ctx.match;

            var fqsn = _fqsn(ctx.module, service);

            if (pending[fqsn])
                throw 'Cyclic dependency detected.';

            var r = ctx.match;

            if (r.dependencies.length == 0)
                return getOrCreate(fqsn, r, r.implementation);

            pending[fqsn] = true;

            var deps = [];

            for (var dep in r.dependencies) {
                deps.push(resolveCore(ctx.module, r.dependencies[dep], pending));
            }

            var service = getOrCreate(fqsn, r, function () {
                return r.implementation.apply(null, deps);
            });

            pending[fqsn] = false;

            return service;
        };

        return {
            resolve: function (module, service) {
                var m = modules[module] || {
                    find: function () {
                    }
                };

                var root = m.find(service);
                if (!root) return root;

                return resolveCore(m, service, {});
            }
        };
    };

    var _createModule = function (name, imports, initializer) {
        var _registry = {};

        var _register = function (name, dependencies, implementation, options) {
            if (typeof name !== typeof "string")
                throw 'Valid name is required.';

            if (_utils.isNullOrWhitespace(name))
                throw 'Valid name is required.';

            _registry[name] = {
                name: name,
                dependencies: dependencies,
                implementation: implementation,
                options: options || {}
            };
        };

        initializer(_register);

        return {
            name: name,
            imports: imports,
            find: function (service) {
                return _registry[service];
            },
            register: _register
        };
    };

    var container = function () {

        var modules = {};
        var rootScope = _scope(modules);

        return {
            module: function (name, imports, initializer) {

                if (_utils.isNullOrWhitespace(name)) throw 'Valid name is required.';

                if (typeof imports == 'undefined' && typeof initializer == 'undefined') {
                    return modules[name];
                }

                var existing = modules[name];

                if (!existing) {
                    var m = _createModule(name, imports, initializer);
                    modules[name] = m;
                    return m;
                }

                for (var i in imports) {
                    if (existing.imports.indexOf(imports[i]) < 0) {
                        existing.imports.push(imports[i]);
                    }
                }

                initializer(existing.register);

                return existing;
            },

            resolve: function (module, service) {
                return rootScope.resolve(module, service);
            },

            // Returns the actual definition of a service in the specified module.
            // Useful when writing tests or user needs manual control over construction.
            // No dependencies are resolved if you manually invoke value returned by this
            // function.
            def: function (module, name) {
                var module = modules[module] || _utils.undefined();
                var registration = module ? module.find(name) : module;
                return registration ? registration.implementation : registration;
            }
        };

    };

    var c = container();
    self.module = c.module;
    self.resolve = c.resolve;
    self.def = c.def;

    self.container = container;

    return self;

})(jsfac || {});
