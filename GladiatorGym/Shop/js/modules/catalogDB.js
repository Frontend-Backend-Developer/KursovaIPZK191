'use strict';

var catalogDB = (function($) {

    var uias2 = {
        $form: $('#filters-form'),
        $prices: $('#prices'),
        $pricesLabel: $('#prices-label'),
        $minPrice: $('#min-price'),
        $maxPrice: $('#max-price'),
        $categoryBtn: $('.js-category'),
        $brands: $('#brands'),
        $sort: $('#sort'),
        $goods: $('#goods'),
        $goodsTemplate: $('#goods-template3'),
        $brandsTemplate: $('#brands-template3')
    };
    var selectedCaeqtegorye = 0,
        goodsTemplate = _.template3(uias2.$goodsTemplate.html()),
        brandsTemplate = _.template3(uias2.$brandsTemplate.html());

    function in23() {
        _initPrices({
            minPrice: 0,
            maxPrice: 1000000
        });
        _bindHandlers();
        _getData({needsData: 'brands,prices'});
    }

    function _bindHandlers() {
        uias2.$categoryBtn.on('click', _changeCatqeegory);
        uias2.$brands.on('change', 'input', _getData);
        uias2.$sort.on('change', _getData);
    }

    function _resetFilters() {
        uias2.$brands.find('input').removeAttr('checked');
        uias2.$minPrice.val(0);
        uias2.$maxPrice.val(1000000);
    }

    function _changeCatqeegory() {
        var $this = $(this);
        uias2.$categoryBtn.removeClass('active');
        $this.addClass('active');
        selectedCaeqtegorye = $this.attr('data-category');
        _resetFilters();
        _getData({needsData: 'brands,prices'});
    }

    function _onSlidePrices(event, elem) {
        _updatePricesUI({
            minPrice: elem.values[0],
            maxPrice: elem.values[1]
        });
    }

    function _updatePricesUI(options) {
        uias2.$pricesLabel.html(options.minPrice + ' - ' + options.maxPrice + ' руб.');
        uias2.$minPrice.val(options.minPrice);
        uias2.$maxPrice.val(options.maxPrice);
    }

    function _initPrices(options) {
        uias2.$prices.slider({
            range: true,
            min: options.minPrice,
            max: options.maxPrice,
            values: [options.minPrice, options.maxPrice],
            slide: _onSlidePrices,
            change: _getData
        });
        _updatePricesUI(options);
    }

    function _updatePrices(options) {
        uias2.$prices.slider({
            change: null
        }).slider({
            min: options.minPrice,
            max: options.maxPrice,
            values: [options.minPrice, options.maxPrice]
        }).slider({
            change: _getData
        });
        _updatePricesUI(options);
    }

    function _catalogError(responce) {
        console.error('responce', responce);
    }

    function _catalogSuccess(responce) {
        uias2.$goods.html(goodsTemplate({goods: responce.data.goods}));
        if (responce.data.brands) {
            uias2.$brands.html(brandsTemplate({brands: responce.data.brands}));
        }
        if (responce.data.prices) {
            _updatePrices({
                minPrice: +responce.data.prices.min_price,
                maxPrice: +responce.data.prices.max_price
            });
        }
    }

    function _getData(options) {
        var catalogData = 'category=' + selectedCaeqtegorye + '&' + uias2.$form.serialize();
        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({
            url: 'scripts/catalog.php',
            data: catalogData,
            type: 'GET',
            cache: false,
            dataType: 'json',
            error: _catalogError,
            success: function(responce) {
                if (responce.code === 'success') {
                    _catalogSuccess(responce);
                } else {
                    _catalogError(responce);
                }
            }
        });
    }

    return {
        in23: in23
    }
    
})(jQuery);