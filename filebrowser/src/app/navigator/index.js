(function (ng) {
    "use strict";

    ng
        .module('browser.app.navigator', [ 'ui.router', 'templates.app' ])
        .controller('NavigateController', ['$scope', '$state', function ($scope, $state) {
        	var remote = require('electron').remote;

        	var fs = remote.require('fs'),
        		os = remote.require('os'),
        		process = remote.require('process')
        		;

        	$scope.user = process.env['USER'];
        }]);
})(angular);
