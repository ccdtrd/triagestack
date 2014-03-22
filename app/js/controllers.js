'use strict';

/* Controllers */

angular.module('triage.controllers', []).
  controller('FlowCtrl', ['$scope', '$timeout','TriageService', function($scope, $timeout, TriageService) {

    $scope.onTimeout = function(){
      console.log('FlowCtrl.onTimeout');
      
      TriageService.getAllComponents()
        .success(function(data, status){
          try{
                $(document.getElementById('demoSVG').contentDocument)
                .find('desc')
                .each(function(index, element){
                    var id = $(element.firstChild).text();
                    var status = find_component(data, id).status;
                    apply_status(element.parentElement.id, status_color(status), '#000000');
                });
            }catch(err){
                console.log(err);
            }
        })
        .error(function(data, status){
          console.log(data);
        });

      mytimeout = $timeout($scope.onTimeout,1000);
    };

    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

    function find_component(data, id){
        var component = _.find(data,function(component){
            if(component.name === id){
                return true;
            }
        });
        if(component){ return component; }
        else return {};
    };

    function status_color(status){
        if(status){
            if(/PASS/.test(status)){
                return '#6DB370';
            }else if(/FAIL/.test(status)){
                return '#FF625F';
            }else if(/WARN/.test(status)){
                return '#FEBD01';
            }else if(/CRITICAL/.test(status)){
                return '#465866';
            }else if(/PAUSE/.test(status)){
                return '#2AC8E8';
            }
        }
        return '#666666';
    };

    function apply_status(id, fill, stroke) {
      var doc = document.getElementById('demoSVG').contentDocument;
      var circle = doc.getElementById(id);
      circle.style.fill = fill;
    };

  }])
  .controller('ConsoleCtrl', ['$scope', '$timeout','TriageService', function($scope, $timeout, TriageService) {
  	
    $scope.onTimeout = function(){
      console.log('FlowCtrl.onTimeout');
      
      TriageService.getAllComponents()
      .success(function(data, status){
        $scope.enterprise = _.last(data);
        $scope.components = data.slice(0,data.length-1);
      })
      .error(function(data, status){
        console.log(data);
      })

      mytimeout = $timeout($scope.onTimeout,1000);
    };

    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

  }]);