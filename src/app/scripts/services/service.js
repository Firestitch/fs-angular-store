

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
                    angular.forEach(obj, function (val, key) {

                        if(options.storage===undefined || options.storage=='localstorage') {
                            $localStorage[key] = encrypt(val);
                        } else if(options.storage=='memory') {
                            _memory[key] = encrypt(val);
                        }

                        if(!options.notify) {
                            watcher(key,encrypt(val));
                        }
                    });
                }

                return this;
            }

            function remove(obj) {

                if(obj) {
                    obj = typeof obj === 'object' ? obj : [obj];

                    angular.forEach(obj,function(value) {
                        delete $localStorage[value];

                        watcher(value);
                    });
                }
                return this;
            }

            function watch(key, func, options) {
                options = options || {};

                if(options.compare) {

                    $rootScope.$watch(function() {

                        if(options.storage=='memory') {
                            return _memory[key];
                        } else {
                            return $localStorage[key];
                        }

                    },function(newVal, oldVal) {
                        if(newVal !== undefined) {
                            func(newVal, oldVal);
                        }
                    },options.compare);

                } else {
                    _watches.push({ key: key, func: func, options: options });
                    func(get(key));
                }

                return this;
            }

            function watcher(key,value) {

                angular.forEach(_watches,function(watch) {
                    if(watch.key==key) {
                        watch.func(value);
                    }
                });

                return this;
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
