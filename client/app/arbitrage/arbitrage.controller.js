(function () {
  angular
    .module('MrArbitrage')
    .controller('arbitrageCtrl', arbitrageCtrl)

  function arbitrageCtrl($scope, $http, $interval, ajaxService) {
    var self = this;
    console.log('arbitrageCtrl');
    $scope.zebpayBuyRates = new Object();
    $scope.zebpaySellRates = new Object();

    $scope.binanceBuyRates = new Object();
    $scope.binanceSellRates = new Object();

    $scope.binanceBuyRatesINR = new Object();
    $scope.binanceSellRatesINR = new Object();

    $scope.oneUSDtoINR = 67;


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

    $scope.determinateValue = 0;
    $scope.determinateFlag = false;


    USDtoINR();
    binanceBTCUSDT();
    fetchZebpay();
    fetchBinance();
    $interval(USDtoINR, 3600000);
    $interval(binanceBTCUSDT, 5000);
    $interval(fetchZebpay, 7000);
    $interval(fetchBinance, 5000);
    $interval(calcProgress, 1000);
  function calcProgress () {
    var count=0;
    for(var i=0 ; i<zebpayCryptos.length ; i++) {
      if($scope.zebpayBuyRates[zebpayCryptos[i]]!=null)
        count++;
      if($scope.zebpaySellRates[zebpayCryptos[i]]!=null)
        count++;
    }
    for(var i=0 ; i<binanceCryptos.length ; i++) {
      if($scope.binanceBuyRatesINR[binanceCryptos[i]]!=null)
        count++;
      if($scope.binanceSellRatesINR[binanceCryptos[i]]!=null)
        count++;
    }

    //buy rate and sell rate of BTC for binance excluded
    if(count==74)
      $scope.determinateFlag = true;
    $scope.determinateValue = (count/74) * 100;
  }

    function binanceBTCUSDT() {
      ajaxService.send('APIcaller2', {
          "url": "https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT"
        }, 'POST')
        .then(function (USDTResults) {
          $scope.binanceBuyRates["BTC"] = USDTResults.data.askPrice;
          $scope.binanceSellRates["BTC"] = USDTResults.data.bidPrice;
          $scope.binanceBuyRatesINR["BTC"] = $scope.oneUSDtoINR * $scope.binanceBuyRates["BTC"];
          $scope.binanceSellRatesINR["BTC"] = $scope.oneUSDtoINR * $scope.binanceSellRates["BTC"];
        })

    }
    //Fetch Zebpay price
    function fetchZebpay() {
      for (var i = 0; i < zebpayCryptos.length; i++) {
        ajaxService.send('APIcaller1', {
            "url": "https://www.zebapi.com/api/v1/market/ticker-new/" + zebpayCryptos[i] + "/inr"
          }, 'POST')
          .then(function (zebpayResults) {
            var name = zebpayResults.data.virtualCurrency;
            $scope.zebpayBuyRates[name] = zebpayResults.data.buy;
            $scope.zebpaySellRates[name] = zebpayResults.data.sell;
          })
      }
    }

    //Fetch Binance price
    function fetchBinance() {
      for (var i = 0; i < binanceCryptos.length; i++) {
        ajaxService.send('APIcaller2', {
            "url": "https://api.binance.com/api/v3/ticker/bookTicker?symbol=" + binanceCryptos[i] + "BTC"
          }, 'POST')
          .then(function (binanceResults) {
            var name = binanceResults.data.symbol;
            name = name.replace("BTC", "");
            $scope.binanceBuyRates[name] = binanceResults.data.askPrice;
            $scope.binanceSellRates[name] = binanceResults.data.bidPrice;
            $scope.binanceBuyRatesINR[name] = binanceResults.data.askPrice * $scope.oneUSDtoINR * $scope.binanceBuyRates["BTC"];
            $scope.binanceSellRatesINR[name] = binanceResults.data.bidPrice * $scope.oneUSDtoINR * $scope.binanceSellRates["BTC"];
          })
      }
    }

    function USDtoINR() {
      ajaxService.send('APIcaller2', {
          "url": "https://free.currencyconverterapi.com/api/v5/convert?q=USD_INR"
        }, 'POST')
        .then(function (USDtoINRResults) {
          $scope.oneUSDtoINR = USDtoINRResults.data.results.USD_INR.val;
        })
    }

    $scope.copyToClipboard = function () {
      var copyText = document.getElementById("address");
      copyText.select();
      document.execCommand("copy");
      alert("Copied the text: " + copyText.value);
    }


  }
})();
