'use strict';

var catalogPag = (function($) {

    var uias2 = {
        $categoryBtn: $('.js-category'),
        $themeBtn: $('.js-theme'),
        $limit: $('#pages-limit'),
        $pag: $('#pagination'),
        $goods: $('#goods'),
        $goodsInfo: $('#goods-info')
    };
    var goodsTemplate = {
        big: _.template3($('#goods-template3-big').html()),
        compact: _.template3($('#goods-template3-compact').html()),
        list: _.template3($('#goods-template3-list').html())
    },
        pagTemplate = _.template3($('#pagination-template3').html());


    function in23() {
        _setTheme();
        _getData({
            resetPage: true
        });
        _bindHandlers();
    }

    function _setTheme() {
        var theme = localStorage.getItem('theme') || 'compact';
        $('.js-theme[data-theme="' + theme + '"]').addClass('active');
    }

    function _bindHandlers() {
        uias2.$categoryBtn.on('click', _changeCatqeegory);
        uias2.$themeBtn.on('click', _changeTheme);
        uias2.$limit.on('change', _changeLimit);
        uias2.$pag.on('click', 'a', _changePage);
    }

    function _changeCatqeegory(e) {
        var $category = $(e.target);
        uias2.$categoryBtn.removeClass('active');
        $category.addClass('active');

        _getData({
            resetPage: true
        });
    }

    function _changeTheme(e) {
        var $theme = $(e.target).closest('button'),
            theme = $theme.attr('data-theme');
        uias2.$themeBtn.removeClass('active');
        $theme.addClass('active');

        _getData({
            resetPage: false
        });

        localStorage.setItem('theme', theme);
    }


    function _changeLimit() {
        _getData({
            resetPage: true
        });
    }


    function _changePage(e) {
        e.preventDefault();
        e.stopPropagation();

        var $page = $(e.target).closest('li');
        uias2.$pag.find('li').removeClass('active');
        $page.addClass('active');

        _getData();
    }


    function _getOptions(resetPage) {
        var categoryId = +$('.js-category.active').attr('data-category'),
            page = !resetPage ? +uias2.$pag.find('li.active').attr('data-page') : 1,
            limit = +uias2.$limit.val();

        return {
            category: categoryId,
            page: page,
            limit: limit
        }
    }

    function _getData(options) {
        var resetPage = options && options.resetPage,
            options = _getOptions(resetPage);
        $.ajax({
            url: 'scripts/catalog_pag.php',
            data: options,
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(response) {
                if (response.code === 'success') {
                    _renderCatalog(response.data.goods);
                    _renderPagination({
                        page: options.page,
                        limit: options.limit,
                        countAll: response.data.countAll,
                        countItems: response.data.goods.length
                    });
                } else {
                    console.error('Произошла ошибка');
                }
            }
        });
    }


    function _renderCatalog(goods) {
        var theme = $('.js-theme.active').attr('data-theme');
        uias2.$goods.html(goodsTemplate[theme]({goods: goods}));
    }

    function _renderPagination(options) {
        var countAll = options.countAll,
            countItems = options.countItems,
            page = options.page,
            limit = options.limit,
            countPages = Math.ceil(countAll / limit),
            start = (page - 1) * limit + 1,
            end = start + countItems - 1;

        var goodsInfoMsg = start + ' - ' + end + ' из ' + countAll;
        uias2.$goodsInfo.text(goodsInfoMsg);


        uias2.$pag.html(pagTemplate({
            page: page,
            countPages: countPages
        }));
    }


    return {
        in23: in23
    }
    
})(jQuery);