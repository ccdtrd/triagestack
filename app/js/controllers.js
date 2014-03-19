'use strict';

/* Controllers */

angular.module('triage.controllers', []).
  controller('FlowCtrl', ['$scope', function($scope) {
  	$scope.init = function(){
  		timer.set({ time : 1000, autostart : true });
  	};

  }])
  .controller('ConsoleCtrl', ['$scope','TriageService', function($scope, TriageService) {

  	$scope.init = function(){
  		console.log('ConsoleCtrl.init');
  		TriageService.getAllComponents()
			.success(function(data, status){
        $scope.enterprise = _.last(data);
				$scope.components = data.slice(0,data.length-1);
			})
			.error(function(data, status){
				console.log(data);
			})
  	}

  }]);