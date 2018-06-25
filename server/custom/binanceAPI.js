var request = require('request');
request("https://api.binance.com/api/v3/ticker/bookTicker", function (error, response, body) {
  return JSON.parse(body);
});