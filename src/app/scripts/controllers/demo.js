

    'use strict';
    angular.module('app')
    .controller('DemoCtrl', function ($scope, fsStore) {

    	fsStore.watch('test',function(value) {
    		
    	});

        fsStore.set('test','TEST!');

        alert(fsStore.get('test'));

    });
