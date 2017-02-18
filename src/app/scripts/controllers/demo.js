

    'use strict';
    angular.module('app')
    .controller('DemoCtrl', function ($scope, fsStore, $timeout) {

    	fsStore.watch('test.state',function(value) {
    		console.log(value);
    	});

    	fsStore.set('test.state',{ state: 'xxx' });

    	var test = {};
    	/*
        fsStore.set('test',test);

        fsStore.set('test',test);
*/
        fsStore.set('test',{ state: 'xxx2' });
        fsStore.set('test',{ state: 'xxx2', something: '111' });

        fsStore.set('test',{ state: '11111' });

        fsStore.remove('test');
        //fsStore.set('test',"SASDASD");
        //fsStore.set('test-another',"SASDASD");

        //fsStore.reset(['test-another']);


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
