'use strict';


// Declare app level module which depends on filters, and services
angular.module('triage', [
  'ngRoute',
  'triage.filters',
  'triage.services',
  'triage.directives',
  'triage.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/flow', {templateUrl: 'partials/flow.html'});
  $routeProvider.when('/console', {templateUrl: 'partials/console.html'});
  $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
  $routeProvider.when('/signin', {templateUrl: 'partials/signin.html'});
  $routeProvider.when('/signup', {templateUrl: 'partials/signup.html'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
