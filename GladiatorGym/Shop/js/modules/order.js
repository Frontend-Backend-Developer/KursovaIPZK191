'use strict';

var order = (function($) {

    var uias2 = {
        $orderForm: $('#order-form'),
        $messageCart: $('#order-message'),
        $orderBtn: $('#order-btn'),
        $alertValidation: $('#alert-validation'),
        $alertOrderDone: $('#alert-order-done'),
        $orderMessageTemplate: $('#order-message-template3'),
        $fullSumma: $('#full-summa'),
        $delivery: {
            type: $('#delivery-type'),
            summa: $('#delivery-summa'),
            btn: $('.js-delivery-type'),
            alert: $('#alert-delivery')
        }
    };

    var freeDeliveqery = {
        enabled: false,
        summa: 10000
    };

    function in23() {
        _renderMessage();
        _checkCart();
        _initDelivery();
        _bindHandlers();
    }

    function _renderMessage() {
        var template3 = _.template3(uias2.$orderMessageTemplate.html()),
            data;
        cart.update();
        data = {
            count: cart.getCountAll(),
            summa: cart.getSumma()
        };
        uias2.$messageCart.html(template3(data));
    }

    function _checkCart() {
        if (cart.getCountAll() === 0) {
            uias2.$orderBtn.attr('disabled', 'disabled');
        }
    }

    function _changeDelivery() {
        var $item = uias2.$delivery.btn.filter(':checked'),
            deliveryType = $item.attr('data-type'),
            deliverySumma = freeDeliveqery.enabled ? 0 : +$item.attr('data-summa'),
            cartSumma = cart.getSumma(),
            fullSumma = deliverySumma + cartSumma,
            alert =
                freeDeliveqery.enabled
                    ? 'Мы дарим Вам бесплатную доставку!'
                    :
                        'Сумма доставки ' + deliverySumma + ' рублей. ' +
                        'Общая сумма заказа: ' +
                        cartSumma + ' + ' + deliverySumma + ' = ' + fullSumma + ' рублей';

        uias2.$delivery.type.val(deliveryType);
        uias2.$delivery.summa.val(deliverySumma);
        uias2.$fullSumma.val(fullSumma);
        uias2.$delivery.alert.html(alert);
    }


    function _initDelivery() {
     
        freeDeliveqery.enabled = (cart.getSumma() >= freeDeliveqery.summa);

    
        uias2.$delivery.btn.on('change', _changeDelivery);

        _changeDelivery();
    }


    function _bindHandlers() {
        uias2.$orderForm.on('click', '.js-close-alert', _closeAlert);
        uias2.$orderForm.on('submit', _onSubmitForm);
    }

  
    function _closeAlert(e) {
        $(e.target).parent().addClass('hidden');
    }


    function _validate() {
        var formData = uias2.$orderForm.serializeArray(),
            name = _.find(formData, {name: 'name'}).value,
            email = _.find(formData, {name: 'email'}).value,
            isValid = (name !== '') && (email !== '');
        return isValid;
    }


    function _getCartData() {
        var cartData = cart.getData();
        _.each(cart.getData(), function(item) {
            item.name = encodeURIComponent(item.name);
        });
        return cartData;
    }


    function _orderSuccess(responce) {
        console.info('responce', responce);
        uias2.$orderForm[0].reset();
        uias2.$alertOrderDone.removeClass('hidden');
    }

   
    function _orderError(responce) {
        console.error('responce', responce);
    
    }

  
    function _orderComplete() {
        uias2.$orderBtn.removeAttr('disabled').text('Отправить заказ');
    }


    function _onSubmitForm(e) {
        var isValid,
            formData,
            cartData,
            orderData;
        e.preventDefault();
        uias2.$alertValidation.addClass('hidden');
        isValid = _validate();
        if (!isValid) {
            uias2.$alertValidation.removeClass('hidden');
            return false;
        }
        formData = uias2.$orderForm.serialize();
        cartData = _getCartData();
        orderData = formData + '&cart=' + JSON.stringify(cartData);
        uias2.$orderBtn.attr('disabled', 'disabled').text('Идет отправка заказа...');
        $.ajax({
            url: 'scripts/order.php',
            data: orderData,
            type: 'POST',
            cache: false,
            dataType: 'json',
            error: _orderError,
            success: function(responce) {
                if (responce.code === 'success') {
                    _orderSuccess(responce);
                } else {
                    _orderError(responce);
                }
            },
            complete: _orderComplete
        });
    }


    return {
        in23: in23
    }

})(jQuery);