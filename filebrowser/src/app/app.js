(function (ng) {
    "use strict";

    ng
        .module('browser.app', [
            'ui.router',
            'templates.app',
            'browser.app.navigator'
        ])
        .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/nav/")

            $stateProvider.state('nav', {
                url: '/nav/{path:.*}',
                templateUrl: 'wrapper/index.tpl.html'
            })
        }])
        .directive('includeReplace', function () {
            return {
                require: 'ngInclude',
                restrict: 'A', /* optional */
                link: function (scope, el, attrs) {
                    el.replaceWith(el.children());
                }
            };
        });

})(angular);
