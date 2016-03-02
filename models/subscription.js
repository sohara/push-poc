var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  subscriptionId: String
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
