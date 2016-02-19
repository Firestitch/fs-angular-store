(function () {
    'use strict';

    angular.module('fs-angular-banner')
    .factory('fsBanner', function () {
 
        function Banner(options) {
            this._options = options || {};
            this._options.avatar = this._options.avatar || {};
            this._options.actions = this._options.actions || [];
            this._options.avatar.action = this._options.avatar.action || {};
            this._options.styles = this._options.styles || '';

            this.avatarActionClick = function(icon, func) {
                this._options.avatar.action.icon = icon;
                this._options.avatar.action.click = func;
            };

            this.background = function(background) {
                this._options.styles = "background-image: url('" + background + "');";
            };

            this.avatarActionUpload = function(icon, func, options) {
                options = options || {};
                options.select = func;
                this._options.avatar.action.icon = icon;
                this._options.avatar.action.upload = options;
            };

            this.addSubmitAction = function(icon, form, options) {
                var options = options || {};
                options.form = form;
                this.addAction(icon, null, 'submit', options);
            };

            this.addClickAction = function(icon, func, options) {
                this.addAction(icon, func, 'click', options);
            };

            this.addActionTemplate = function(template, scope, options) {
                var options = options || {};
                var action = {  options: options,
                                template: template,
                                type: 'template',
                                scope: scope };

                this._options.actions.push(action);
            };


            this.addAction = function(icon, func, type, options) {
                var options = options || {};
                var action = {  func: func,
                                icon: icon,
                                options: options,
                                type: type || 'click' };

                this._options.actions.push(action);
            };

            this.headline = function(headline) {
                this._options.headline = headline;
            };

            this.headlineTemplate = function(template, scope) {
                this._options.headline = { template: template, scope: scope };
            };

            this.subheadline = function(subheadline) {
                this._options.subheadline = subheadline;
            };

            this.subheadlineTemplate = function(template, scope) {
                this._options.subheadline = { template: template, scope: scope };
            };

            this.avatarImage = function(image) {
                this._options.avatar.image = image;
            };

            this.avatarIcon = function(icon) {
                this._options.avatar.icon = icon;
            };

            this.options = function() {
                return this._options;
            };

            return this;
        }

        var service = {
            create: create
        };
       
        return service;

        function create(options) {
            return new Banner(options); 
        }

    });
})();