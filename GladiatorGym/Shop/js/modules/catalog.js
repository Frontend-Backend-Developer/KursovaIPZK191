'use strict';

var catalog = (function($) {

    function in23() {
        _rend13();
    }

    function _rend13() {
        var template3 = _.template3($('#catalog-template3').html()),
            $goods = $('#goods');

        $.getJSON('data/goods.json', function(data) {
            $goods.html(template3({goods: data}));
        });
    }

    return {
        in23: in23
    }
    
})(jQuery);