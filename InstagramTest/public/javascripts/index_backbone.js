$('document').ready(function() {


    var ResultData = Backbone.Model.extend({
        urlRoot : '/searchInsta'
    });
    
    var AllResultData = Backbone.Collection.extend({
        model : ResultData
    });
    
    var TagsResult = Backbone.View.extend({
        el: $('#main'),

        template: Handlebars.compile('<div class="box">\
        <img src="{{images.low_resolution.url}}"\
        {{#each tags}} #{{this}} {{/each}}\
        </div>'),

        render: function() {
            this.el.append(this.template(this.model.toJSON()));
        }
    });

    var SearchView = Backbone.View.extend({
        events : {
            'click button#searchBtn' : 'search'
        },

        search : function() {
            var resultData = new ResultData({
                option: $("#selectbox option:selected").val(),
                inputValue : $("#inputValueId").val()
            });
        }
    });

    $('#searchBtn').click(function() {
        $.get("/searchInsta", {
            "option" : $("#selectbox option:selected").val(),
            "inputValue" : $("#inputValueId").val()
        }).done(function(result) {
            window.searchResult = JSON.parse(result);
            console.log(searchResult.data.length, searchResult);

            function render() {
                if (_.has(searchResult.data[0], 'images')) {
                    _.each(searchResult.data, function(data) {
                        $('#main').append("<img src='"+data.images.low_resolution.url+"'>");
                    });
                } else {
                    _.each(searchResult.data, function(data) {
                        $('#main').append("<img src='" + data.profile_picture + "'>"
                        + "이름:" + data.full_name +" 아이디:" + data.username);
                    });
                }
            };

            render();

            if (_.has(searchResult.data[0], 'images')) {
                $(window).scroll(function() {
                    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                        alert('end of window!');
                        $.get('/searchInsta', {
                            "next_url" : searchResult.pagination.next_url
                        }).done(function(result) {
                            searchResult = JSON.parse(result);
                            console.log(searchResult.data.length, searchResult);
                            render();
                        })

                    }
                });
            }
        });
    });



});
