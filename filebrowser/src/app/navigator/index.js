(function (ng) {
    "use strict";

    ng
        .module('browser.app.navigator', [ 'ui.router', 'templates.app', 'browser.app.service.fileservice' ])
        .controller('NavigateController', [ '$scope', '$rootScope', '$state', '$timeout', 'fileio', function ($scope, $rootScope, $state, $timeout, fileio) {

        	$scope.home = fileio.getHomeDirectory();

        	$scope.user = fileio.getUser();
        	$scope.currdir = $state.params.path || fileio.getHomeDirectory();
        	$scope.dirtree = [ $scope.currdir ];
        	$scope.currfile = undefined;

        	$scope.setTree = function(fileObj, ignore) {
    			$scope.currfile = undefined;

        		if(fileObj.isDir) {
        			console.log('dir...');
		        	if(!ignore) {
		        		console.log('saving...');
		        		console.log($scope.dirtree[$scope.dirtree.length - 1]);
		        		$rootScope.$emit('action', $scope.dirtree[$scope.dirtree.length - 1]);
		        	}

        			var prev = fileObj.path.substring(0, fileObj.path.lastIndexOf(fileio.sep));
	        		if(!prev) { prev = '/'; }
	        		var index = $scope.dirtree.indexOf(prev);
	        		$scope.dirtree.splice(index + 1, $scope.dirtree.length - index + 1);

        			$scope.dirtree.push(fileObj.path);

        			$timeout(function() {
		        		document.getElementById('navigator-pane').scrollLeft = $scope.dirtree.length * 225;
		        	}, 350);

        		}
	        	else { $scope.currfile = fileObj.path; }
        	};
        	$scope.cd = function(path, ignore) {
        		$scope.setTree({
    				isDir: true,
    				path: path,
    			}, ignore);
        	}


        	$rootScope.$on('direction', function(event, cmd, arg) {
        		switch(cmd)
        		{
        			case 'up':
        				console.log('Going Up!');
        				if($scope.dirtree.length > 1) { $scope.cd($scope.dirtree[$scope.dirtree.length - 1]); }
        				break;
        			case 'back':
        				console.log('Going Back!');
        				$scope.cd(arg, true);
        				break;
        			case 'forward':
        				console.log('Going Forward!');
        				$scope.cd(arg, true);
        				break;
        		}
        	});
        }])
        .directive('directoryPanel', [ 'appio', 'fileio', function(appio, fileio) {
        	return {
        		restrict: 'E',
        		scope: { path: '=', navigate: '&' },
        		templateUrl: 'navigator/panel.tpl.html',
        		link: function($scope, $element, $attrs) {
        			var remote = require('electron').remote;

		        	var fs = remote.require('fs'),
		        		path = remote.require('path'),
		        		windowManager = remote.require('electron-window-manager')
		        		;

		        	function ls(path) {
		        		return fs.readdirSync(path);
		        	}

		        	$scope.open = function(fileObj) {
		        		if(fileObj.isDir) {
		        			console.log(window.location.href + fileObj.path);
		        			windowManager.open(null, 'Open File Browser',
		        				window.location.href + fileObj.path
		        			);
		        		} else {
		        			appio.launch(fileObj.path);
		        		}
		        	}

        			$scope.content = ls($scope.path)
        				.filter(function(filename) { return !/(^|\/)\.[^\/\.]/g.test(filename); })
        				.map(function(filename) {
        					var stats = fs.lstatSync(path.join($scope.path, filename));
        					return {
        						name: filename,
        						path: path.join($scope.path, filename),
        						ext: filename.split('.').pop(),
        						isDir: stats.isDirectory(),
        						stats: stats
        					};
        				});

    				$scope.activateFile = function($event) {
		        		var $ = require('jquery');
		        		$('#navigator-pane .active').closest('.file-item').removeClass('selected');
		        		$('#navigator-pane .active')
		        			.closest('.file-item')
		        			.filter(function(index, element) {
		        				var filename = $(element).children(":visible").text().trim();
		        				console.log(filename + ' vs ' + $scope.path);
		        				console.log($scope.path.indexOf(filename))
		        				return $scope.path.indexOf(filename) < 0;
		        			})
		        			.removeClass('active');
		        		$($event.toElement).closest('.file-item').addClass('active');
		        		$($event.toElement).closest('.file-item').addClass('selected');
		        	}

        			$scope.getFileIcon = fileio.getFileIcon;
        		}
        	};
        }])
        .directive('filePanel', [ 'fileio', function(fileio) {
        	return {
        		restrict: 'E',
        		scope: { file: '@' },
        		templateUrl: 'navigator/fileinfo.tpl.html',
        		link: function($scope, $element, $attrs) {
        			$scope.$watch("file", function(newValue, oldValue) {
        				if(newValue) { $scope.info = fileio.fileInfo(newValue); }
				    });

        			$scope.info = fileio.fileInfo($scope.file);

        			$scope.previews = {
        				//"txt": I Don't Know!
        			};
        		}
        	}
        }]);
})(angular);
