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

    $scope.oneUSDtoINR = 70;

    self.masterCryptoList = [
    ["BTC", "BTC", "../../assets/img/btc.png"],
    ["ETH", "ETH", "../../assets/img/eth.png"],
    ["BCH", "BCC", "../../assets/img/bch.png"],
    ["LTC", "LTC", "../../assets/img/ltc.png"],
    ["XRP", "XRP", "../../assets/img/xrp.png"],
    ["EOS", "EOS", "../../assets/img/eos.png"],
    ["OMG", "OMG", "../../assets/img/omg.png"],
    ["TRX", "TRX", "../../assets/img/trx.png"],
    ["GNT", "GNT", "../../assets/img/gnt.png"],
    ["ZRX", "ZRX", "../../assets/img/zrx.png"],
    ["REP", "REP", "../../assets/img/rep.png"],
    ["KNC", "KNC", "../../assets/img/knc.png"],
    ["BAT", "BAT", "../../assets/img/bat.png"],
    ["AE", "AE", "../../assets/img/ae.png"],
    ["IOST", "IOST", "../../assets/img/iost.png"],
    ["ZIL", "ZIL", "../../assets/img/zil.png"],
    ["CMT", "CMT", "../../assets/img/cmt.png"],
    ["NCASH", "NCASH", "../../assets/img/ncash.png"],
    ["TUSD", "TUSD", "../../assets/img/tusd.png"]

    ] ;
    self.zebpayCryptos = [
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
      "NCASH",
      "TUSD"
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
      "VET",
      "AE",
      "IOST",
      "ZIL",
      "CMT",
      "NCASH",
      "TUSD"
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
    $interval(fetchCoindelta, 5000);
    $interval(calcProgress, 1000);
  function calcProgress () {
    var determinantLength = ((self.zebpayCryptos.length-1) * 4) - 4;
    var count=0;
    for(var i=0 ; i<self.zebpayCryptos.length ; i++) {
      if($scope.zebpayBuyRates[self.zebpayCryptos[i]]!=null)
        count++;
      if($scope.zebpaySellRates[self.zebpayCryptos[i]]!=null)
        count++;
    }
    for(var i=0 ; i<binanceCryptos.length ; i++) {
      if($scope.binanceBuyRatesINR[binanceCryptos[i]]!=null)
        count++;
      if($scope.binanceSellRatesINR[binanceCryptos[i]]!=null)
        count++;
    }

    //buy rate and sell rate of BTC for binance excluded
    if(count>=determinantLength)
      $scope.determinateFlag = true;
    $scope.determinateValue = (count/determinantLength) * 100;
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
      for (var i = 0; i < self.zebpayCryptos.length; i++) {
        ajaxService.send('APIcaller1', {
            "url": "https://www.zebapi.com/api/v1/market/ticker-new/" + self.zebpayCryptos[i] + "/inr"
          }, 'POST')
          .then(function (zebpayResults) {
            var name = zebpayResults.data.virtualCurrency;
            $scope.zebpayBuyRates[name] = zebpayResults.data.buy;
            $scope.zebpaySellRates[name] = zebpayResults.data.sell;
          })
      }
    }

    function fetchCoindelta() {
      ajaxService.send('APIcaller1', {
        "url": "https://api.coindelta.com/api/v1/public/getticker/"
      }, 'POST')
      .then(function (coindeltaResults) {
        for(var i=0 ; i<coindeltaResults.length ; i++) {
          var name = coindeltaResults[i].MarketName.split('-')[0];
          $scope.coinDeltaBuyRates[name] = coindeltaResults[i].Ask;
          $scope.coinDeltaSellRates[name] = coindeltaResults[i].Bid;
        }
        console.log(coinDeltaBuyRates);
        console.log(coinDeltaSellRates);
      })
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

