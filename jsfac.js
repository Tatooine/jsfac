var jsfac = (function (self) {
    var _utils = {
        isNullOrWhitespace: function (string) {
            return !string ? true : !/\S/.test(string);
        },

        isString : function(obj){
            return typeof obj !== typeof "string";
        },

        isUndefined: function(ob){
            return typeof ob === 'undefined';
        },

        toArray: function(obj){
            return Array.prototype.slice.apply(obj);
        },

        extend: function(target, source){
            target = target || {};

            for(var p in source) {
                if(source.hasOwnProperty(p) && source[p]) {
                    target[p] = source[p];
                }
            }

            return target;
        },

        forEach: function(obj, iterator) {
            if(_utils.isUndefined(obj.length)) {
                for(var key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        iterator.call(null, obj[key], key);
                    }
                }
            } else {
                if(Array.prototype.forEach) {
                    Array.prototype.forEach.call(obj, iterator);
                } else {
                    for(var i=0; i<obj.length; i++) {
                        iterator.call(null, obj[i], i);
                    }
                }
            }

            return obj;
        }
    };

    // Scope has the ability to resolve a specified service
    // based on modules configured.
    var _scope = function (modules) {

        var sharedInstances = {};

        var _fqsn = function (module, service) {
            return module.name + '-' + service;
        };

        var _getOrCreate = function (name, registration, factory) {

            if (registration.options.sharingMode !== 'single') {
                return factory();
            }

            if (!_utils.isUndefined(sharedInstances[name]))
                return sharedInstances[name];

            sharedInstances[name] = factory();
            return sharedInstances[name];
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

        var _buildLazy = function(module, service){
            return function(){
                return _resolveCore(module, service, {});
            };
        };

        var _resolveCore = function (module, service, pending) {

            var ctx = _findRegistration(module, service);
            if (!ctx.match) return ctx.match;

            var fqsn = _fqsn(ctx.module, service);

            if (pending[fqsn])
                throw 'Cyclic dependency detected.';

            var r = ctx.match;

            if (r.dependencies.length == 0)
                return _getOrCreate(fqsn, r, r.implementation);

            pending[fqsn] = true;

            var deps = [];

            for (var dep in r.dependencies) {
                var d = r.dependencies[dep];                
                deps.push(
                    d.lazy ? _buildLazy(ctx.module, d.name) 
                    : _resolveCore(ctx.module, d.name, pending));
            }

            var service = _getOrCreate(fqsn, r, function () {
                return r.implementation.apply(null, deps);
            });

            pending[fqsn] = false;

            return service;
        };

        return {
            resolve: function (module, service) {
                var m = modules[module];

                var root = m && m.find(service);
                if (!root) return root;

                return _resolveCore(m, service, {});
            }
        };
    };

    var _dependencyDescriptions = function(dependencies){
        var r = [];
        for(var d in dependencies){
            var item = dependencies[d];
            if(typeof item === 'string'){
                r.push({
                  name: item,
                  lazy: false
                });
            }
            else{
                if(!item.name) throw 'Dependency name is required';
                r.push(item);
            }
        }

        return r;
    };

    var _createModule = function (modName, imports, debug) {
        var _registry = {};

        var _register = function (name, dependencies, implementation, options) {
            if (_utils.isString(name) || _utils.isNullOrWhitespace(name))
                throw new Error('Valid name is required.');

            if(!debug) {
                _registry[name] = {
                    name: name,
                    dependencies: _dependencyDescriptions(dependencies),
                    implementation: implementation,
                    options: options || {}
                };
            } else {
                _registry[name] = {
                    name: name,
                    dependencies: _dependencyDescriptions(dependencies),
                    implementation: function() {
                        var deps = _utils.toArray(arguments);
                        return { module:modName, name:name, deps:deps };
                    },
                    options: {}
                };
            }
        };
        
        return {
            name: modName,
            imports: imports,
            register: _register,
            find: function (service) {
                return _registry[service];
            },
            register: _register,
            registry : _registry
        };
    };

    var _debug = function() {
        var modules = {};
        var rootScope = _scope(modules);

        return {
            resolve: function (module, service) {
                return rootScope.resolve(module, service);
            },

            graph : function() {
                var r = [];
                _utils.forEach(modules, function(module){
                    _utils.forEach(module.registry, function(service){
                        r.push(rootScope.resolve(module.name, service.name));
                    });
                });

                return r;
            },

            createModule : function(name, imports) {
                modules[name] = _createModule(name, imports, true);
            },

            modules: modules
        };
    };

    var container = function () {
        var modules = {};        
        var rootScope = _scope(modules);
        var debug = _debug();

        return {
            module: function (name, imports, initializer) {

                if (_utils.isNullOrWhitespace(name)) throw new Error('Valid name is required.');

                if (_utils.isUndefined(imports) && _utils.isUndefined(initializer)) {
                    return modules[name];
                }

                var existing = modules[name];

                if (!existing) {
                    existing = modules[name] = _createModule(name, imports);
                    debug.createModule(name, imports);

                } else {
                    for (var i in imports) {
                        if (existing.imports.indexOf(imports[i]) < 0) {
                            existing.imports.push(imports[i]);
                        }
                    }
                }

                initializer(function(){
                    existing.register.apply(existing, arguments);
                    debug.modules[name].register.apply(existing, arguments);
                });

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
                var module = modules[module] || _utils.undefined;
                var registration = module ? module.find(name) : module;
                return registration ? registration.implementation : registration;
            },

            debug: {
                resolve: debug.resolve,
                graph : debug.graph
            }
        };
    };

    var c = container();
    _utils.extend(self, c);
    self.container = container;

    return self;

})(jsfac || {});
