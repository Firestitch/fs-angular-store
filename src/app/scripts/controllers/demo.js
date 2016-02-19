

    'use strict';
    angular.module('app')
    .controller('DemoCtrl', function ($scope, fsStore) {

        fsStore.set('test','TEST!');

        alert(fsStore.get('test'));

    });
