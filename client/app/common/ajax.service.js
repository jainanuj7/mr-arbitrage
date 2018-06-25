(function () {
    'use strict';
  
    angular
      .module('MrArbitrage')
      .service('ajaxService', ajaxService);
  
    function ajaxService($q, $http) {
      var service = {};
  
      service.send = function (api, data, method) {
        var def = $q.defer();
        $http({
          // url: 'http://localhost:3000/'+api,
          url: 'https://mr-arbitrage.herokuapp.com/'+api,
          method: method,
          data: data,
        }).then(function (res) {
          def.resolve(res);
        },function (err) {
            console.log(err)
          
        });
        return def.promise;
      }
  
      return service;
    }
  })();
  
