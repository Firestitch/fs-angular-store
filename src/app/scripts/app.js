'use strict';

angular
.module('app', [
    'config',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngAnimate',
    'fs-angular-store'
])
.config(function ($routeProvider, $mdThemingProvider,fsStoreProvider) {

    //fsStoreProvider.encryption('asdasasdasdad');
    
    $routeProvider
    .when('/demo', {
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl',       
    })

    .when('/404', {
        templateUrl: 'views/404.html'
    })
    
    .otherwise({
        redirectTo: '/demo'
    });

  $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': 'f44336',
    '600': 'e53935',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName');

    $mdThemingProvider.alwaysWatchTheme(true);
})
.run(function () {

});
