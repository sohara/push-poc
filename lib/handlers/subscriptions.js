var _ = require('lodash');
var Subscription = require('../models/subscription');

/**
 * Create subscription
 *
 * @param {Object} body - request body
 * @param {Function} callback - callback func
 * @returns {undefined} undefined
 * @public
 */
exports.create = function (body, callback) {
  var subscription = new Subscription();
  subscription.subscriptionId = body.subscriptionId;
  subscription.save(_.partialRight(callback, {message: 'Subscription created!'}));
};

/**
 * Get all subscriptions
 *
 * @param {Function} callback - callback func
 * @returns {undefined} undefined
 * @public
 */
exports.read = function (callback) {
  Subscription.find(callback);
};
