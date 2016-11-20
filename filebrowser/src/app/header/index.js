(function (ng) {
    "use strict";

    ng
        .module('browser.app.toolbar', [ 'ui.router', 'templates.app' ])
        .controller('ToolbarController', [ '$scope', '$rootScope', function ($scope, $rootScope) {
            console.log("Toolbar loading!");


            $scope.undoStack = [  ];
            $scope.redoStack = [  ];

        	$scope.goBack = function()
            {
                console.log('Back! ' + pop);
                var pop = $scope.undoStack.pop();
                $scope.redoStack.push(pop);
                $rootScope.$emit('direction', 'back', pop);
            };
            $scope.goUp = function()
            {
                console.log('Up!');
                $rootScope.$emit('direction', 'up');
            };
            $scope.goForward = function()
            {
                var pop = $scope.redoStack.pop();
                console.log('Forward! ' + pop);
                $rootScope.$emit('direction', 'forward', pop);
            };

            $rootScope.$on('action', function(event, path) {
                console.log('Action Taken! ' + path);
                $scope.undoStack.push(path);
                console.log($scope.undoStack);
            });

            console.log("Toolbar loaded!");
        }]);
})(angular);
