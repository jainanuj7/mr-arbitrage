(function () {
  angular
    .module('MrArbitrage')
    .controller('arbitrageCtrl', arbitrageCtrl)

  function arbitrageCtrl($scope, $http, ajaxService) {
    var self = this;
    console.log('arbitrageCtrl');
    var cryptos = [
      "BTC",
      "ETH",
      "BCH",
      "LTC",
      "XRP",
      "EOS",
      "OMG",
      "TRX",
      "GNT",
      "ZRX",
      "REP",
      "KNC",
      "BAT",
      "VEN",
      "AE",
      "IOST",
      "ZIL",
      "CMT",
      "NCASH"
    ];
    //fetchZebpay();
    fetchBinance();

    //Fetch Zebpay price
    function fetchZebpay() {
      var zebpayBuyRates = new Object();
      var zebpaySellRates = new Object();
      for (var i = 0; i < cryptos.length; i++) {
        $http.get("https://www.zebapi.com/api/v1/market/ticker-new/" + cryptos[i] + "/inr")
          .then(function (zebpayResults) {
            var name = zebpayResults.data.virtualCurrency;
            zebpayBuyRates[name] = zebpayResults.data.buy;
            zebpaySellRates[name] = zebpayResults.data.sell;
            console.log(zebpayBuyRates);
            console.log(zebpaySellRates);
          })
      }
    }

    //Fetch Binance price
    function fetchBinance() {

      var binanceBuyRates = new Object();
      var binanceSellRates = new Object();
      for (var i = 0; i < cryptos.length; i++) {
        ajaxService.send('binance', {
            "url": "https://api.binance.com/api/v3/ticker/bookTicker?symbol="+ cryptos[i] +"BTC"
          }, 'POST')
          .then(function (result) {
            console.log(result);
          })
      }
    }
  }
})();
