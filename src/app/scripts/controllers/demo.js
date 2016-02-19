'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsBanner) {

  	var banner = fsBanner.create();
    banner.background('http://tri-niche.com/wp-content/uploads/2015/01/Gradient-1.jpg');
    banner.headlineTemplate('Headline<hr>');
   	banner.avatarIcon('person');
    banner.subheadline('Subheadline');
    banner.avatarImage('https://images.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png');
    banner.avatarActionUpload('photo_camera',
                                function(file) {
                                	alert('upload()');
                                    /*
                                    meService.avatar(file[0])
                                    .then(function(user) {
                                        $scope.avatarImage(user.avatar.small);
                                        fsAlert.success('Your avatar has been updated successfully.');
                                    });
									*/
                                }, { 'ngf-accept': 'image/*' });


    banner.addActionTemplate(['<md-fab-speed-dial md-direction="left" class="md-fling" md-open="false">',
                            '<md-fab-trigger>',
                                '<md-button aria-label="Add..." class="md-fab md-raised  md-primary">',
                                    '<md-icon>settings</md-icon>',
                                '</md-button>',
                            '</md-fab-trigger>',
                            '<md-fab-actions>',
                                '<md-button aria-label="Add Event" class="md-fab md-raised md-mini md-primary" ng-click="doit()">',
                                    '<md-icon>add</md-icon>',
                                '</md-button>',
                                '<md-button aria-label="Environment" class="md-fab md-raised md-mini md-primary">',
                                    '<md-icon>language</md-icon>',
                                '</md-button>',
                            '</md-fab-actions>',
                        '</md-fab-speed-dial>'].join(''),{ doit: function() { alert("doit"); }});

    banner.addAction('save',
                            function() {
                                alert('save()');
                            });

    banner.addSubmitAction('save','form');

    $scope.bannerOptions = banner.options();

    $scope.text = '';
    
    $scope.submit = function() {
        alert('submit');
    }
});
