// knex 0.7.3 의 jsonb 타입 미지원 해결책
var path = require('path');
/* 최신 버전 compiler */
var fullPath = path.resolve(__dirname, '..', 'node_modules/knex/lib/dialects/postgres/query/compiler');
require(fullPath);
var _postgreSQLQueryBuilderAndCompiler = require.cache[fullPath + '.js'].exports;
require.cache[fullPath + '.js'].exports = function(client) {
    _postgreSQLQueryBuilderAndCompiler.apply(this, arguments);

    function forJSONB(values) {
        var values = _.clone(values);
        _.each(values, function(val, key) {
            if (!_.isObject(val)) values[key] = val;
            else values[key] = JSON.stringify(val);
        });
        return values;
    }

    client.QueryCompiler.prototype.insert = function() {
        var self = this;
        var insertValues = this.single.insert;

        var sql = 'insert into ' + this.tableName + ' ';

        if (_.isArray(insertValues) && (insertValues.length === 1) && _.isEmpty(insertValues[0])) {
            insertValues = [];
        }

        if (_.isEmpty(insertValues) && !_.isFunction(insertValues)) {
            sql += this._emptyInsertValue;
        } else {
            var insertData = this._prepInsert(forJSONB(insertValues)); // 고쳐진 부분

            if (_.isString(insertData)) {
                sql += insertData;
            } else  {
                if (insertData.columns.length) {
                    sql += '(' + this.formatter.columnize(insertData.columns) + ') values (' +
                        _.map(insertData.values, this.formatter.parameterize, this.formatter).join('), (') + ')';
                } else {
                    // if there is no target column only insert default values
                    sql += '(' + self.formatter.wrap(self.single.returning) + ') values ' + _.map(insertData.values, function () { return '(' + (self._defaultInsertValue || '') + ')'; }).join(', ');
                }
            }
        }

        var returning  = this.single.returning;
        return {
            sql: sql + this._returning(returning),
            returning: returning
        };
    };

    client.QueryCompiler.prototype.update = function() {
        var updateData = this._prepUpdate(forJSONB(this.single.update)); // 고쳐진 부분
        var wheres     = this.where();
        var returning  = this.single.returning;
        return {
            sql: 'update ' + this.tableName + ' set ' + updateData.join(', ') +
            (wheres ? ' ' + wheres : '') +
            this._returning(returning),
            returning: returning
        };
    };
}

var knexfile = require('./knexfile');
GLOBAL.knex = require('knex')(knexfile.development);
GLOBAL.bookshelf = require('bookshelf')(knex);

// knex 0.7.3 fix #519 https://github.com/tgriesser/knex/issues/519
var Client_PG = require('../node_modules/knex/lib/dialects/postgres');
var replaceQ$ = new RegExp("\\$Q", 'g');
Client_PG.prototype.positionBindings = function(sql) {
    var questionCount = 0;
    return sql.replace(/\?/g, function() {
        questionCount++;
        return '$' + questionCount;
    }).replace(replaceQ$, function() {
        return '?';
    });
};

bookshelf.plugin('visibility');
bookshelf.plugin('virtuals');