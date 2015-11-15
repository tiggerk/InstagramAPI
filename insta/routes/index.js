var express = require('express');
var Promise = require('bluebird');
var _ = require('underscore');
var router = express.Router();
var request = require('request');
var db = require('../db/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Instagram' });
});

Promise.promisifyAll(request);

var current = Promise.resolve();
router.get('/api/insta/:tags', function() {

});

router.post('/api/insta/', function(req, res, next) {
    var tags = req.body['tags[]'];
    Promise.all(_.map(tags, function(tag) {
        return makeTagUrl(tag);
    })).then(function(results) {
        return Promise.all(_.map(results, setData));
    }).then(function() {
        return db.Instas.forge().query(function(query) {
            query.whereRaw(
                "search_tag $Q| " +
                "array" + JSON.stringify(tags).replace(/"/g, "'")
            );
        }).fetch();
    }).then(function(instas) {
        //console.log(instas)
        res.json(JSON.stringify(instas.toJSON()));
    }).catch(function(err) {
        //console.log(err);
    });

    function setData(result, index) {
        var body = JSON.parse(_.first(result).body);
        return Promise.all(body.data).map(function(data) {
            var model = db.Insta.forge({
                media_id: data.id,
                user_insta_id: data.user.id,
                user_username: data.user.username,
                images_url_640x640: data.images.standard_resolution.url,
                images_url_320x320: data.images.low_resolution.url,
                search_tag: _.object(data.tags, data.tags)
            });
            var cModel = new model.constructor();

            return cModel.query(function(q) {
                q.where(model.pick('media_id'));
            }).fetch().then(function() {
                if (!cModel.get('id')) return saveModel(model);
            });
        }).then(function(models) {
            if(_.some(models)) return nextUrl(body.pagination.next_url, index);
            return _.extend({ data: models }, _.omit(body, 'data'));
        });
    }

    function saveModel(model) {
        return model.save().then(function(m) {
            return m;
        }).catch(function(err) {
            console.log(err);
        });
    }

    function nextUrl(url, index) {
        if(url == undefined) return ;
        return request.getAsync(url).then(function(result) {
            return setData(result, index);
        });
    }

    function makeTagUrl(tag) {
        var url = [];
        url.push('https://api.instagram.com/v1/tags/');
        url.push(tag);
        url.push('/media/recent?access_token=');
        url.push('433848139.9018f55.2e472bd6fe2d4549876ae7f06fa3436a');
        return request.getAsync(url.join(''));
    }
});

module.exports = router;
