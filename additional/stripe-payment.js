var stripe = require("stripe@4.24.0");
var priceByProduct = {"3month": 3000, "6month": 5000, "12month": 9900};

module.exports = function (context, cb) {
    var product = context.body.product;
    var calculatedAmount = priceByProduct[product] || 0;
    // console.log("calculatedAmount: " + calculatedAmount);
    // console.log("product: " + product + ", " + priceByProduct[product]);
    // console.log("stripeToken.id: " + context.body.stripeToken.id);
    stripe(context.secrets.stripeSecretKey).charges.create({
        amount: calculatedAmount,
        currency: "aud",
        source: context.body.stripeToken.id,
        metadata: {"product": product, "recipientName": context.body.recipientName, "recipientAdditionalInfo": context.body.recipientAdditionalInfo, "shippingAddress": context.body.shippingAddress, "fromName": context.body.fromName},
        description: "Sticker order: " + product + ", for: " + context.body.recipientName + ", with info: " + context.body.recipientAdditionalInfo
    }, function (error, charge) {
        var status = error ? 400 : 200;
        
        if(error) {
          cb(error, error.message);
        } else {
          cb(null, "Charge applied, thanks!");
        }
    });
};
