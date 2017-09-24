var stripe = require("stripe@4.24.0");
var priceByProduct = {"2month": 2000, "3month": 3000, "6month": 5000};
var descriptionByProduct = {"2month": "2 month", "3month": "3 month", "6month": "6 month"}

module.exports = function (context, cb) {
    var cxt = context.body;
    var product = cxt.product;
    var calculatedAmount = priceByProduct[product] || 0;
    stripe(context.secrets.stripeSecretKey).charges.create({
        amount: calculatedAmount,
        currency: "aud",
        source: cxt.stripeToken.id,
        receipt_email: cxt.stripeToken.email,
        metadata: {"product": product, "recipientName": cxt.recipientName, "recipientAdditionalInfo": cxt.recipientAdditionalInfo, "shippingAddress": cxt.shippingAddress, "fromName": cxt.fromName},
        description: descriptionByProduct[product] + " sticker subscription"
    }, function (error, charge) {
        var status = error ? 400 : 200;
        
        if(error) {
          cb(error, error.message);
        } else {
          cb(null, "Charge applied, thanks!");
        }
    });
};
