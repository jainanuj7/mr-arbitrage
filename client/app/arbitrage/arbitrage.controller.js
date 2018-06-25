(function () {
  angular
    .module('MrArbitrage')
    .controller('arbitrageCtrl', arbitrageCtrl)

  function arbitrageCtrl($scope, $http, ajaxService) {
    var self = this;
    console.log('arbitrageCtrl');
    var zebpayCryptos = [
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

    var binanceCryptos = [
      "ETH",
      "BCC",
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
    USDtoINR();

    //Fetch Zebpay price
    function fetchZebpay() {
      var zebpayBuyRates = new Object();
      var zebpaySellRates = new Object();
      for (var i = 0; i < zebpayCryptos.length; i++) {
        $http.get("https://www.zebapi.com/api/v1/market/ticker-new/" + zebpayCryptos[i] + "/inr")
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
      for (var i = 0; i < binanceCryptos.length; i++) {
        ajaxService.send('APIcaller', {
            "url": "https://api.binance.com/api/v3/ticker/bookTicker?symbol=" + binanceCryptos[i] + "BTC"
          }, 'POST')
          .then(function (binanceResults) {
            var name = binanceResults.data.symbol;
            name = name.replace("BTC", "");
            binanceBuyRates[name] = binanceResults.data.askPrice;
            binanceSellRates[name] = binanceResults.data.bidPrice;
            console.log(binanceBuyRates);
            console.log(binanceSellRates);
          })
      }
    }

    function USDtoINR() {
      ajaxService.send('APIcaller', {
          "url": "https://free.currencyconverterapi.com/api/v5/convert?q=USD_INR"
        }, 'POST')
        .then(function (USDtoINRResults) {
          $scope.oneUSDtoINR = USDtoINRResults.data.results.USD_INR.val;
          console.log($scope.oneUSDtoINR);
        })
    }

    //$interval(USDtoINR, 3600000);
  }
})();
