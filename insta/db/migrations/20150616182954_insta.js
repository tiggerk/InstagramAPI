
exports.up = function(knex, Promise) {
    return new Promise(function(rs) {
        knex.schema.createTable('insta', function (table) {
            table.increments('id').primary();
            table.boolean('is_selected').default(false);
            table.string('media_id').unique();
            table.string('user_insta_id', 31)
            table.string('user_username', 31);
            table.json('search_tag', true);
            table.text('images_url_320x320');
            table.text('images_url_640x640');
            table.timestamps();
        }).then(function() {
            rs();
        }).catch(function(err) {
            console.error(err)
        });;
    });
};

exports.down = function(knex, Promise) {
    return new Promise(function(rs) {
        knex.schema.dropTable('insta').then(function() {
            rs();
        });
    });
};
