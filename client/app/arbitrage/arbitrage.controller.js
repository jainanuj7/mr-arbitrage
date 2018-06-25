(function () {
  angular
    .module('MrArbitrage')
    .controller('arbitrageCtrl', arbitrageCtrl)

  function arbitrageCtrl() {
    var self = this;

    self.onInit = function () {
      console.log('arbitrageCtrl');
    };

    self.onInit();
  }
})();
