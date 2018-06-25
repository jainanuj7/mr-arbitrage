(function () {
  angular
    .module('MrArbitrage')
    .controller('arbitrageCtrl', arbitrageCtrl)

  function arbitrageCtrl($scope, $http, ajaxService) {
    var self = this;
    console.log('arbitrageCtrl');
    var zebpayBuyRates = new Object();
    var zebpaySellRates = new Object();
    
    var binanceBuyRates = new Object();
    var binanceSellRates = new Object();
    
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
    //fetchBinance();
    //USDtoINR();
    binanceBTCUSDT();

    function binanceBTCUSDT() {
      ajaxService.send('APIcaller', {
          "url": "https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT"
        }, 'POST')
        .then(function (USDTResults) {
          binanceBuyRates["BTC"] = USDTResults.data.askPrice;
          binanceSellRates["BTC"] = USDTResults.data.bidPrice;
          console.log($scope.BTCUSDT);
        })

    }
    //Fetch Zebpay price
    function fetchZebpay() {
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
