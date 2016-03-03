var request = require('request');

var GCP_API_KEY = 'AIzaSyAbpf2LS3le6y-zhZW0UgjWmhaZBc0u6T8';
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

/**
 * Create notification
 *
 * @param {Object} body - request body
 * @param {Function} callback - callback func
 * @returns {undefined} undefined
 * @public
 */
exports.create = function (body, callback) {
  var subscriptionId = body.subscriptionId;

  var data = {
    registration_ids: [subscriptionId]
  };

  var options = {
    url: GCM_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + GCP_API_KEY
    },
    method: 'POST',
    body: JSON.stringify(data)
  };

  request(options, function (error, response, body) {
    console.log(error);
    console.log(body);
    callback(error, response, body);
  });
};
