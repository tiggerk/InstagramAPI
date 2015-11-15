var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : 'localhost',
        user     : 'dahyun',
        password : '',
        database : 'insta',
        charset  : 'utf8'
    },
    debug: false
});
require('./jsonb-question');
var bookshelf = require('bookshelf')(knex);

var Insta = bookshelf.Model.extend({
    tableName: 'insta',
    defaults: {
        media_id: '',
        user_insta_id: '',
        user_username: '',
        images_url_640x640: '',
        images_url_320x320: '',
        search_tag: ''
    },
    hasTimestamps: ['created_at', 'updated_at']
});

var Instas = bookshelf.Collection.extend({
    model: Insta
});

module.exports = {
    Insta: Insta,
    Instas: Instas
};

