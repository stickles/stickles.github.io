(function(){
  var widget, initAF = function(){
    widget = new AddressFinder.Widget(
      document.getElementById('shipping-address'),
      'UNPYFJQACL8KM34HERX9',
      'AU',
      {
      }
    );
    };

  function downloadAF(f){
    var script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.async = true;
    script.onload = f;
    document.body.appendChild(script);
  };

  document.addEventListener('DOMContentLoaded', function () {
    downloadAF(initAF);
  });
})();
