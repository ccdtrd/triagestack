'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('triage.services', [])
	.value('version', '0.1')
  .service('TriageService', function($http) {
    return {
      setData: function (data) {
          components = data;
      },
      getAllComponents: function () {
				return $http.get('/services/demo/_all');
      }
    };
	});
