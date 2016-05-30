

    'use strict';
    angular.module('app')
    .controller('DemoCtrl', function ($scope, fsStore, $timeout) {

    	fsStore.watch('test',function(value) {
    		//debugger;
    	}, true);

    	var test = {};
        fsStore.set('test',test);
        fsStore.set('test',"SASDASD");
        fsStore.set('test-another',"SASDASD");

        fsStore.reset(['test-another']);

        
        $timeout(function() {

        	//test.hello = "!!!!!";

        },2000);

/*

        $timeout(function() {

        	fsStore.set('test','^^^!!!!');
        },4000);        

		*/
        //alert(fsStore.get('test'));

    });
