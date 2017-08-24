(function(){
  var priceByProduct = {'3month': 3000, '6month': 5000, '12month': 9900};
  var niceTextByProduct = {'3month': '3 MONTHS', '6month': '6 MONTHS', '12month': '12 MONTHS'};
  var product = window.location.href.split('#').pop().split('=').pop();
  var formattedProduct = niceTextByProduct[product];
  var buyButton = $('form#buy button');

  var handler = StripeCheckout.configure({
    key: 'pk_test_f7SD5elorg7zf0GTSWQTDVQh',
    image: 'assets/images/stickles-logo-s-128x128.png',
    locale: 'auto',
    token: function(token, addresses) {
      buyButton.prop("disabled", true);
      buyButton.text('BUYING ' + formattedProduct + '...')
      console.log(token)
      $.ajax({
          url: 'https://serverless.stickles.com.au/wt-1080b541cc4067bc473e93f43f434b82-0/stripe-payment',
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            shippingAddress: $('#shipping-address').val(),
            recipientName: $('#recipient-name').val(),
            recipientAdditionalInfo: $('#recipient-additional-info').val(),
            fromName: $('#from-name').val(),
            product: product,
            stripeToken: token
          })
      }).then(function(stripeCustomer) {
        $('div#success').show();
        buyButton.hide();
      }).fail(function(e) {
        buyButton.text('BUY ' + formattedProduct);
        $('div#error').text('There was an error processing the payment. Please try again. Error: ' + e.responseJSON.message);
        $('div#error').show();
      });
    }
  });

  $(function() {
    buyButton.text('BUY ' + formattedProduct);

    $('form#buy').submit(function(e) {
      e.preventDefault();
      $('div#error').hide();
      handler.open({
        name: 'Stickles package',
        description: formattedProduct,
        panelLabel: 'Buy ' + formattedProduct.toLowerCase() + ' for',
        amount: priceByProduct[product] || 0,
        allowRememberMe: true
      });
    });
  });

  $(window).on('popstate', function() {
    handler.close();
  });
})();
