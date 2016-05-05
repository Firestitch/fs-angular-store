

(function () {
    'use strict';

    angular.module('fs-angular-store',['ngStorage'])
    .provider('fsStore', function() {

        var _encryption = false;
        var _cryptokey = 'fs93jd83hf92j2';

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

            function get(str, def) {                

                if(!$localStorage.hasOwnProperty(str) && def!==undefined) {
                    $localStorage[str] = def;
                }

                if(_encryption) {
                    return decrypt($localStorage[str]);
                }
                    
                return $localStorage[str];
            }

            function set(obj,value) {

                //if both these variables are set then treat as key value pair
                if(obj && value) {
                    var obj1 = {};
                    obj1[obj] = value;
                    obj = obj1;
                }

                if (typeof obj === 'object') {
                    // if object is a proper object, process normally
                    angular.forEach(obj, function (val, key) {
                        $localStorage[key] = encrypt(val);                        
                    });
                }

                return this;
            }

            function remove(obj) {

                if(obj) {
                    obj = typeof obj === 'object' ? obj : [obj];

                    angular.forEach(obj,function(value) {
                        delete $localStorage[value];
                    });
                }
                return this;
            }

            function watch(key, func, deep) {

                $rootScope.$watch(function () { return $localStorage[key]; },function(newVal, oldVal) {
                    if(newVal !== undefined) {
                        func(newVal, oldVal);
                    }
                },deep)
                return this;
            }

            function reset() {
                $localStorage.$reset();
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
