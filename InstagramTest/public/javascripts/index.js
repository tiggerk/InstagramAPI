$('document').ready(function() {

    $('#searchBtn').click(function() {
        $.get("/searchInsta", {
            "option" : $("#selectbox option:selected").val(),
            "inputValue" : $("#inputValueId").val()
        }).done(function(result) {
            window.searchResult = JSON.parse(result);
            //console.log(searchResult.data.length, _.pluck(searchResult.data, 'id'));
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
                            //console.log(searchResult.data.length);
                            //console.log(_.pluck(searchResult.data, 'id'));
                            console.log(searchResult.data.length, searchResult);
                            render();
                        })

                    }
                });
            }
        });
    });

});
