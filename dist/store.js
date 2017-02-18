





(function () {
    'use strict';

    angular.module('fs-angular-store',['ngStorage'])
    .provider('fsStore', function() {

        var _encryption = false;
        var _cryptokey = 'fs93jd83hf92j2';
        var _memory = {};
        var _watches = [];

        this.encryption = function(cryptokey) {
            if(cryptokey) {
                _cryptokey = cryptokey;
            }

            _encryption = true;
        };

        this.$get = function($localStorage, $log, $rootScope) {

            var service = {
                set: set,
                get: get,
                reset: reset,
                remove: remove,
                display: display,
                watch: watch
            };

            return service;

            function get(str, defaults, options) {
                options = options || {};

                if(options.storage=='memory') {

                    if(!_memory.hasOwnProperty(str) && defaults!==undefined) {
                        _memory[str] = defaults;
                    }

                    if(_encryption) {
                        return decrypt(_memory[str]);
                    }

                    return _memory[str];

                } else {
                    if(!$localStorage.hasOwnProperty(str) && defaults!==undefined) {
                        $localStorage[str] = defaults;
                    }

                    if(_encryption) {
                        return decrypt($localStorage[str]);
                    }

                    return $localStorage[str];
                }
            }

            function set(obj, value, options) {
                options = options || {};

                //if both these variables are set then treat as key value pair
                if(obj && value) {
                    var obj1 = {};
                    obj1[obj] = value;
                    obj = obj1;
                }

                if (typeof obj === 'object') {
                    // if object is a proper object, process normally
                    angular.forEach(obj, function (val, name) {

                        var old = get(name);
                        if(options.storage===undefined || options.storage=='localstorage') {
                            $localStorage[name] = encrypt(val);
                        } else if(options.storage=='memory') {
                            _memory[name] = encrypt(val);
                        }

                        if(!options.notify) {
                            watcher(name,val,old);
                        }
                    });
                }

                return this;
            }

            function remove(obj,options) {
                options = options || {};

                if(obj) {
                    obj = typeof obj === 'object' ? obj : [obj];

                    angular.forEach(obj,function(name) {
                        var old = get(name);
                        delete $localStorage[name];
                        if(!options.notify) {
                            watcher(name,undefined,old);
                        }
                    });
                }
                return this;
            }

            function watch(key, func, options) {
                options = options || {};

                _watches.push({ key: key, func: func, options: options });

                var value = evalulate(get(key.replace(/\..*/,'')),key);

                func(value);

                return this;
            }

            function watcher(key,value,old) {

                angular.forEach(_watches,function(watch) {

                    if(watch.key.match(new RegExp('^' + key))) {

                        var v1 = evalulate(value, watch.key);
                        var v2 = evalulate(old, watch.key);

                        if(v1!==v2) {
                            watch.func(v1,v2);
                        }
                    }
                });

                return this;
            }

            function evalulate(data, path, step) {

                if(!step) {
                    step = 0;
                }

                if(!step) {
                    path = path.split('.');
                    path.shift();
                }

                var item = path.shift();

                if(item===undefined)
                    return data;

                try {
                    var data = data[item];
                    if(data===undefined)
                        throw 'undefined';

                } catch(e) {
                    return undefined;
                }

                step++;

                return evalulate(data,path,step);
            }

            function reset(data) {

                if(angular.isArray(data)) {

                    angular.forEach(data,function(item) {
                        remove(item);
                    });
                } else {
                    $localStorage.$reset();
                }

                return this;
            }

            function encrypt(obj) {

                if(_encryption) {

                    if(typeof CryptoJS != 'object')
                        throw 'CryptoJS library not found';

                    if(obj) {

                        obj = JSON.stringify(obj);
                        obj = CryptoJS.AES.encrypt(obj, _cryptokey).toString();
                    }
                }

                return obj;
            }

            function decrypt(obj) {

                if(_encryption) {

                    if(typeof CryptoJS != 'object')
                        throw 'CryptoJS library not found';

                    if(obj) {

                        obj = CryptoJS.AES.decrypt(obj, _cryptokey).toString(CryptoJS.enc.Utf8);
                        obj = JSON.parse(obj);
                    }
                }

                return obj;
            }

            function display() {

                angular.forEach($localStorage,function(value,key) {
                    if(typeof value === 'string') {
                        $log.info({ key: key, value: decrypt(value) });
                    }
                });
            }

        };
    });

})();


