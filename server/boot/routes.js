var request = require('request');
module.exports = function (app) {
  app.post('/APIcaller1', function (req, res) {
    request(req.body.url, function (error, response, body) { 
    res.send(body);
    });
  })

  app.post('/APIcaller2', function (req, res) {
    request(req.body.url, function (error, response, body) { 
    res.send(body);
    });
  })
}
