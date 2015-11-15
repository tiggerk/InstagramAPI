$(function() {
    var stateFlag = false;

    var datasCb = function(result) {
        var datas = JSON.parse(result);
        console.log(datas);
        $('.result').append(_.map(datas, function(data) {
            return '<img src="' + data.images_url_320x320 + '"></a>';
        }));
        $('.content').data('next', datas.pagination.next_max_tag_id || null);
        stateFlag = false;
        $('.ajax-loader').hide();
    };
    var tags = ['초콜렛','피자','chocolate'];
    $.post('/api/insta/', {
        'tags': tags
    }, datasCb);

    var clickCb = function(e) {
        tags.push($('input[type="text"]').val());
        $('.content').append($('input[type="text"]').val());
        stateFlag = true;
        e.preventDefault();
        e.stopPropagation();

        $.post('/api/insta/', {
            tags: tags
        }, datasCb);
    };

    function makeUrl($target) {
        return $target.data('val') + '_' + $target.data('next');
    }
    /* start */
    $('button.get-tag').on('click', clickCb);


    $('input[type="text"]').on('change', function() {
        $('.result').html('');
    });
});