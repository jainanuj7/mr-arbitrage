  (function () {
    'use strict';
    angular
      .module('MrArbitrage')
      .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/arbitrage");

        $stateProvider
          .state('arbitrage', {
            url: '/arbitrage',
            templateUrl: 'app/arbitrage/arbitrage.html',
            controller: 'arbitrageCtrl',
            controllerAs: 'arbitrage'
          })
      });

  })();