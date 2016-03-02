var API_KEY = window.GoogleSamples.Config.gcmAPIKey;
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

  // var curlCommand = 'curl --header "Authorization: key=' + API_KEY +
  //   '" --header Content-Type:"application/json" ' + GCM_ENDPOINT +
  //   ' -d "{\\"registration_ids\\":[\\"' + subscriptionId + '\\"]}"';

$( document ).ready(function() {
  console.log( "ready!" );
  $('li a').click(function(e) {
    e.preventDefault();
    var subscriptionId = $(this).data('subscription-id');
    console.log(subscriptionId);
    var data = {
      subscriptionId: subscriptionId
    };
    $.ajax({
      url: '/api/notifications',
      dataType: 'json',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data),
      // headers: {"Authorization": "key=" + API_KEY},
      success: function(data, textStatus, jqxhr) {
        console.log(data);
      },
      error: function(jqxhr, textStatus, err) {
        console.error(err);
      }
    });
  });
});
