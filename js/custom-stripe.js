(function() {
  var details = {
    '2month': { price: 2000, niceText: '2 months', packageText: '2 month package', priceText: '($20)'},
    '3month': { price: 3000, niceText: '3 months', packageText: '3 month package', priceText: '($30)'},
    '6month': { price: 5000, niceText: '6 months', packageText: '6 month package', priceText: '($50)'}
  };

  var product = window.location.href.split('#').pop().split('=').pop();
  var heading = $('div#buy-form-parent-div h1');
  var subHeading = $('div#buy-form-parent-div h2');
  var buyButton = $('#buy-button');
  var form = $('form#buy-form');
  var fieldSet = $('form#buy-form fieldset');
  var formParentDiv = $('div#buy-form-parent-div');
  var processingAlert = $('div#processing');
  var errorAlert = $('div#error');
  var successAlert = $('div#success');
  var successMessage = $('p#success-message');
  var currentOption = $('a.' + product);

  var handler = StripeCheckout.configure({
    key: 'pk_live_pakif5YRABP3c8DdogpEfqcw',
    // key: 'pk_test_f7SD5elorg7zf0GTSWQTDVQh',
    image: 'img/icon.png',
    locale: 'auto',
    currency: 'AUD',
    token: function(token, addresses) {
      formParentDiv.hide();
      processingAlert.show();

      $.ajax({
        url: 'https://serverless.stickles.com.au/wt-1080b541cc4067bc473e93f43f434b82-0/stripe-payment',
        // url: 'https://wt-1080b541cc4067bc473e93f43f434b82-0.run.webtask.io/test-stripe-payment',
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
        successMessage.text('A ' + details[product].packageText + ' is on its way to ' + $('#recipient-name').val() + ' at ' + $('#shipping-address').val() + '.');
        processingAlert.hide();
        successAlert.show();
        fbq('track', 'Purchase', {
          value: '' + details[product].price / 100,
          currency: 'AUD'
        });
        ga('send', 'event', 'Purchase', 'Complete');
      }).fail(function(e) {
        formParentDiv.show();
        processingAlert.hide();
        errorAlert.text('There was an error processing the payment. Please try again. Error: ' + e.responseJSON.message);
        errorAlert.show();
      });
    }
  });

  $(function() {
    buyButton.val('Buy ' + details[product].packageText);
    heading.text('Buy ' + details[product].packageText);
    subHeading.text(details[product].priceText)
    currentOption.remove();

    form.submit(function(e) {
      e.preventDefault();
      errorAlert.hide();
      fbq('track', 'InitiateCheckout');
      ga('send', 'event', 'Purchase', 'Initiate');
      handler.open({
        name: 'Stickles',
        description: details[product].packageText,
        panelLabel: 'Buy ' + details[product].niceText + ' for',
        amount: details[product].price || 0,
        allowRememberMe: true
      });
    });
  });

  $(window).on('popstate', function() {
    handler.close();
  });
})();
