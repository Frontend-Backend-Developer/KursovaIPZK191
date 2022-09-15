'use strict';

var appes1 = (function($) {

    var $body = $('body'),
        page = $body.data('page'),
        options = {
            elAddToCart: '.js-add-to-cart',
            attrId: 'data-id',
            attrName: 'data-name',
            attrPrice: 'data-price',
            attrDelta: 'data-delta',
            elCart: '#cart',
            elTotalCartCount: '#total-cart-count',
            elTotalCartSumma: '#total-cart-summa',
            elCartItem: '.js-cart-item',
            elCartCount: '.js-count',
            elCartSumma: '.js-summa',
            elChangeCount: '.js-change-count',
            elRemoveFromCart: '.js-remove-from-cart'
        },
        optionsCatalog = _.extend({
            renderCartOnInit: false,
            renderMenuCartOnInit: true
        }, options),
        optionsCart = _.extend({
            renderCartOnInit: true,
            renderMenuCartOnInit: true
        }, options),
        optionsOrder = _.extend({
            renderCartOnInit: false,
            renderMenuCartOnInit: true
        }, options);

    function in23() {
        if (page === 'catalog') {
            catalog.in23();
            cart.in23(optionsCatalog);
        }
        if (page === 'catalogDB') {
            catalogDB.in23();
            cart.in23(optionsCatalog);
            compare.in23();
        }
        if (page === 'catalogPag') {
            catalogPag.in23();
            cart.in23(optionsCatalog);
        }
        if (page === 'compare') {
            cart.in23(optionsCatalog);
            compare.in23();
        }
        if (page === 'cart') {
            cart.in23(optionsCart);
        }
        if (page === 'order') {
            order.in23();
            cart.in23(optionsOrder);
        }
        compare.updateCompareTab();
    }
    
    return {
        in23: in23
    }    

})(jQuery);

jQuery(document).ready(appes1.in23);