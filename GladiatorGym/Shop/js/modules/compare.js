'use strict';

var compare = (function($) {

    var uias2 = {
        $body: $('body'),
        elAddToCompare: '.js-add-to-compare',
        elCompareFilters: '.js-compare-filter',
        elCompareRemove: '.js-compare-remove',
        $compareTab: $('#compare-tab'),
        $compareTable: $('#compare-table')
    };

    var tpl11 = {
        filters: _.template3($('#compare-filters-template3').html() || ''),
        header: _.template3($('#compare-header-template3').html() || ''),
        props: _.template3($('#compare-props-template3').html() || '')
    };

    var settings31 = {
        cookie: {
            goods: 'compared_goods',
            category: 'compared_category'
        }
    };

    function _onClickAddToCompare(e) {
        var $button = $(e.target),
            goodId = $button.attr('data-id'),
            categoryId = $button.attr('data-category-id'),
            comparedGoodsStr = $.cookie(settings31.cookie.goods),
            comparedGoodsArr = comparedGoodsStr ? comparedGoodsStr.split(',') : [],
            comparedCategoryId = $.cookie(settings31.cookie.category);

        if (comparedCategoryId && categoryId !== comparedCategoryId) {
            alert('Не допускается сравнивать товары разных категорий');
            return false;
        }

        if (comparedGoodsArr.indexOf(goodId) === -1) {
            comparedGoodsArr.push(goodId);
            $.cookie(settings31.cookie.goods, comparedGoodsArr.join(','), {expires: 365, path: '/'});
            $.cookie(settings31.cookie.category, categoryId, {expires: 365, path: '/'});
            updateCompareTab();
            alert('Товар добавлен к сравнению!');
        } else {
            alert('Этот товар уже есть в списке сравниваемых');
        }
    }

    function _onClickCompareFilters(e) {
        uias2.$compareTable.attr('data-compare', e.target.value);
    }

    function _onClickCompareRemove(e) {
        var id = $(e.target).attr('data-id'),
            goods = $.cookie(settings31.cookie.goods).split(','),
            categoryId = $.cookie(settings31.cookie.category),
            newGoods = _.without(goods, id),
            newGoodsStr = newGoods.join(',');

        if (!newGoodsStr) {
            $.removeCookie(settings31.cookie.goods, {path: '/'});
            $.removeCookie(settings31.cookie.category, {path: '/'});
        }

        document.location.hash = newGoodsStr ? encodeURIComponent(categoryId + '|' + newGoodsStr) : '';
        document.location.reload();
    }

    function _bindHandlers() {
        uias2.$body.on('click', uias2.elAddToCompare, _onClickAddToCompare);
        uias2.$body.on('click', uias2.elCompareFilters, _onClickCompareFilters);
        uias2.$body.on('click', uias2.elCompareRemove, _onClickCompareRemove);
    }

    function updateCompareTab() {
        var comparedGoodsStr = $.cookie(settings31.cookie.goods),
            comparedGoodsArr = comparedGoodsStr ? comparedGoodsStr.split(',') : [],
            comparedCategoryId = $.cookie(settings31.cookie.category),
            compareHref = 'compare.html' + (comparedGoodsArr.length ? '#' + encodeURIComponent(comparedCategoryId + '|' + comparedGoodsStr) : '');

        uias2.$compareTab.find('span').text(comparedGoodsArr.length || '');

        uias2.$compareTab.find('a').attr('href', compareHref);
    }

    function _getBaseProps(goods) {

        var baseProps = [{
            key: 'brand',
            prop: 'Бренд'
        }, {
            key: 'price',
            prop: 'Цена'
        }, {
            key: 'rating',
            prop: 'Рейтинг'
        }];

        var valuesWithIds, values, equal;


        return _.map(baseProps, function(item) {

         
            valuesWithIds = _.map(goods, function(good) {
                return {
                    goodId: good.good_id,
                    value: good[item.key]
                }
            });

        
            values = _.pluck(valuesWithIds, 'value');

           
            equal = _.uniq(values).length === 1;

           
            return {
                prop: item.prop,
                values: valuesWithIds,
                equal: equal
            }
        });
    }

    
    function _getAdditionalProps(props) {
        var valuesWithIds, values, equal;
        return _.chain(props)
            .groupBy('prop')
            .map(function(valuesArray, key) {

            
                valuesWithIds = _.map(valuesArray, function(item) {
                    return {
                        goodId: item.good_id,
                        value: item.value
                    }
                });

            
                values = _.pluck(valuesWithIds, 'value');

              
                equal = (values.length > 1) && (_.uniq(values).length === 1);

                return {
                    prop: key,
                    values: valuesWithIds,
                    equal: equal
                }
            })
            .value();
    }

 
    function _renderCompareTable(response) {
        var filters = [{
                value: 'all',
                title: 'Все',
                checked: true
            },{
                value: 'equal',
                title: 'Совпадающие'
            },{
                value: 'not-equal',
                title: 'Различающиеся'
            }];

        var goods = response.data.goods;

        var allProps = _.union(
            _getBaseProps(goods),
            _getAdditionalProps(response.data.props)
        );


        uias2.$compareTable.find('thead tr').html(tpl11.filters({
            buttons: filters
        }));

      
        uias2.$compareTable.find('thead tr').append(tpl11.header({
            goods: goods
        }));

     
        uias2.$compareTable.find('tbody').append(tpl11.props({
            goods: _.pluck(goods, 'good_id'),
            props: allProps
        }));
    }

   
    function _onAjaxError(response) {
        console.error('response', response);
   
    }

  
    function _initComparePage() {
        var hashData = decodeURIComponent(location.hash).substr(1).split('|'),
            categoryId = hashData.length ? hashData[0] : 0,
            goods = hashData.length ? hashData[1] : [];

        if (!goods) {
            alert('Не выбраны товары для сравнения');
            return false;
        }

 
        $.cookie(settings31.cookie.goods, goods, {expires: 365, path: '/'});
        $.cookie(settings31.cookie.category, categoryId, {expires: 365, path: '/'});

   
        $.ajax({
            url: 'scripts/compare.php',
            data: 'goods=' + encodeURIComponent(goods),
            type: 'GET',
            cache: false,
            dataType: 'json',
            error: _onAjaxError,
            success: function(response) {
                if (response.code === 'success') {
                    _renderCompareTable(response);
                } else {
                    _onAjaxError(response);
                }
            }
        });
    }


    function in23() {
        _bindHandlers();
        if (uias2.$body.attr('data-page') === 'compare') {
            _initComparePage();
        }
    }


    return {
        updateCompareTab: updateCompareTab,
        in23: in23
    }

})(jQuery);