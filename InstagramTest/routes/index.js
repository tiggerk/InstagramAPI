var express = require('express');
var router = express.Router();
var https = require('https');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'InstagramTest' });
});

router.get('/searchInsta', function(req, res, next) {
  console.log(req.query);
  console.log(req.query.option);
  var data = [];

  if (req.query.option == 'tags') {
    https.get('https://api.instagram.com/v1/tags/'+ encodeURIComponent(req.query.inputValue)
    +'/media/recent?access_token=433848139.9018f55.2e472bd6fe2d4549876ae7f06fa3436a', function(res2) {
      console.log('status code', res2.statusCode);
      console.log('headers', res2.headers);
      //var data = [];
      res2.on('data', function(d) {
          data.push(d);
      });
      res2.on('end', function() {
          //res.send(data.join(''));
          res.send(data.join(''));
      });
    });
  } else if (req.query.option == 'userId') {
    https.get('https://api.instagram.com/v1/users/search?q='+ encodeURIComponent(req.query.inputValue)
    +'&count=50&access_token=433848139.9018f55.2e472bd6fe2d4549876ae7f06fa3436a', function(res2) {
      console.log('status code', res2.statusCode);
      console.log('headers', res2.headers);
      //var data = [];
      res2.on('data', function(d) {
        data.push(d);
      });

      res2.on('end', function() {
        res.send(data.join(''));
      })
    });
  } else if (req.query.next_url) {
    https.get(req.query.next_url, function(res2) {
      res2.on('data', function(d) {
          //console.log(d.toString());
          data.push(d);
      });

      res2.on('end', function() {
        res.send(data.join(''));
      });
      //console.log(res2);
    })
  }

});

router.post('/searchName', function(req, res, next) {
  console.log(req.body);

});

module.exports = router;
