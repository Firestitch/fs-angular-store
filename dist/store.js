

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

        this.$get = function($localStorage, $log) {

            var watches = [], service = {
                set: set,
                get: get,
                reset: reset,
                remove: remove,
                display: display,
                watch: watch
            };

            return service;

            function get(str) {

                var val = decrypt($localStorage[str]);
                
                return (typeof val === 'undefined') ? null : val;
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

                        angular.forEach(watches,function(item) {
                            if(item.key==key)
                                item.func(val);
                        });

                        $localStorage[key] = encrypt(val);

                    });
                }
            }

            function remove(obj) {

                if(obj) {
                    obj = typeof obj === 'object' ? obj : [obj];

                    angular.forEach(obj,function(value) {
                        delete $localStorage[value];
                    });
                }
            }

            function watch(key, func) {
                watches.push({ key: key, func: func });
            }            

            function reset() {
                $localStorage.$reset();
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
