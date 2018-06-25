var request = require('request');
module.exports = function (app) {
  app.post('/binance', function (req, res) {
    request(req.body.url, function (error, response, body) { 
    res.send(body);
    });
  })
}
