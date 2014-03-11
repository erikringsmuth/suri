// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https'),
    jwt = require('jwt-simple'),
    jws = require('jws'),
    googleCertificates = {};



// Get the Google Certificates to verify OpenID Connect id_tokens
//
// https://www.googleapis.com/oauth2/v1/certs
var getGoogleCertificates = function getGoogleCertificates(callback) {
  var request = https.request({
    hostname: 'www.googleapis.com',
    path: '/oauth2/v1/certs',
    method: 'GET'
  }, function(response) {

    var responseText = '';

    response.on('data', function (chunk) {
      responseText = responseText + chunk;
    });

    response.on('end', function () {
      // The response contains a certificate like this
      // {
      //  "2784873a666fc894d6c724df0c26c6296493e758": "-----BEGIN CERTIFICATE-----\nMIICITCCAYqgAwIBAgIIN5YrSIb+nWIwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0xNDAzMDkwNjI4MzRaFw0xNDAzMTAxOTI4MzRaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wgZ8wDQYJKoZI\nhvcNAQEBBQADgY0AMIGJAoGBALB5HLJsOF9hdSUU0B2uiyWsUmKCuqQJaExp7DML\npjgDJV92+iVdHcu1mHtuB2LnzgwlOkOJp9g7YeUoU+HhX2bFVXVz5R5z1vyeApKq\n6/MnRym2XcZsi0IqEDPU8IA3ZdL2P4a/qRpAgTkVLGOXLVAe/FTpDKQ68acvj5Yq\nXKCNAgMBAAGjODA2MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1Ud\nJQEB/wQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4GBADGj8G6orcSjCznR\nUwlJ9DCoDKTJkv4W6vaRp70hbSIloBpZIfohicx19ARyxwq3R4r8kEjHS5XDIdi/\nNi1IBXCZRdpHk9z8OlyIV86uWDYoJz0vzthL/apDyIgGRxi6Pf9gGJYAHavt5TEk\n6pXqbd4LAJXuFCzBAkoorjzWn0Vx\n-----END CERTIFICATE-----\n",
      //  "c98f8f084aea475bea45c614e947dfbd10310199": "-----BEGIN CERTIFICATE-----\nMIICITCCAYqgAwIBAgIIXWYbNFqgWPAwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0xNDAzMTAwNjEzMzRaFw0xNDAzMTExOTEzMzRaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wgZ8wDQYJKoZI\nhvcNAQEBBQADgY0AMIGJAoGBAMKR9OmUxfa6wlcLy1X0NhL4FahUiGoXQFWysHwK\nrQu6Vd1THU6CtjZx52TWXI0kIyMUHdHMu5766VACq371dKGCmvKsbenC0MsIZXvr\nK89NP5nbaNs27oADKblf2fw/zFuJdQpIH6fvSLwOv96DyyaUHOk6T+8zSrb7uoTt\nXIwnAgMBAAGjODA2MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1Ud\nJQEB/wQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4GBADs5vypzOwHKddWY\nQXJEYgLkgeuMzrCP4t3MJfquDFqC0aFroRY9fkqIe6s1V8hF2ddziIWTcE0x6Z99\nvBzDlUegrIvl6L+2ibGVByAN1n5B1oH8EfgnuK1kfEhvmAeeX/mh3PISTX85gpUi\nxBgf7bbbROvWuauTPPuvkJhNerXo\n-----END CERTIFICATE-----\n"
      // }
      googleCertificates = JSON.parse(responseText);

      // Async callback when the certificates finish loading
      callback();
    });
  });
  request.end();
  request.on('error', function() {
    // Just don't blow up!
    callback();
  });
};



// Verify the id_token against Google's certificates
//
// https://www.googleapis.com/oauth2/v1/certs
//
// We have to use jws to verify because jwt doesn't support RS256. We have to use jwt to decode
// because jws doesn't deserialize the payload. It only decodes it from base64.
var verifyIdToken = function verifyIdToken(kid, idToken, callback, secondTry) {

  // Verification will only fail if Google changes their certificate (once per day) or it really wasn't a valid
  // certificate (hacked!). If verification fails the first time try refreshing the certificates and verify again.
  var cert = googleCertificates[kid];

  if (cert || secondTry) {
    callback(jws.verify(idToken, cert));
  } else {
    // refresh and try again
    getGoogleCertificates(function() {
      verifyIdToken(kid, idToken, callback, true);
    });
  }
};



// Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token.
module.exports.createOpenIdConnectTokens = function createOpenIdConnectTokens(options, callback) {

  // The user has granted access to suri from Google and the callback returned a one-time authorization
  // code. We need to exchange the code for an OAuth access_token and OpenID Connect id_token.
  //
  // 4. https://developers.google.com/accounts/docs/OAuth2Login#exchangecode
  //
  // POST https://accounts.google.com/o/oauth2/token
  var requestOptions = {
    hostname: 'accounts.google.com',
    path: '/o/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var requestBody = 'client_id=' + options.clientId +
                    '&client_secret=' + options.clientSecret +
                    '&code=' + options.code +
                    '&grant_type=authorization_code' +
                    '&redirect_uri=' + options.redirectUri;

  var request = https.request(requestOptions, function(response) {

    var responseText = '';

    response.on('data', function (chunk) {
      responseText = responseText + chunk;
    });

    response.on('end', function () {
      // Obtain user information from the ID token
      //
      // 5. https://developers.google.com/accounts/docs/OAuth2Login#obtainuserinfo
      var responseJson = JSON.parse(responseText);

      // Verify the id_token against Google's certificates
      //
      // https://www.googleapis.com/oauth2/v1/certs
      var encodedIdTokenHeader = responseJson.id_token.split('.')[0];
      var idTokenHeader = JSON.parse(new Buffer(encodedIdTokenHeader, 'base64').toString());
      verifyIdToken(idTokenHeader.kid, responseJson.id_token, function(verified) {
        if (!verified) {
          callback({ success: false, message: 'Authentication failed. The id_token signature did not verify against the certificate.' });
        }

        // Decode the id_token once it's been verified
        var decodedIdToken = jwt.decode(responseJson.id_token, {}, true);

        // Verify the id_token aud and iss
        //
        // https://developers.google.com/accounts/docs/OAuth2Login#validatinganidtoken
        if (decodedIdToken.aud !== options.clientId) {
          callback({ success: false, message: 'Authentication failed. The id_token.aud does not match the client ID.' });
        }
        if (decodedIdToken.iss !== 'accounts.google.com') {
          callback({ success: false, message: 'Authentication failed. The id_token.iis is not Google.' });
        }

        callback({ success: true, tokens: responseJson, decoded_id_token: decodedIdToken });
      });
    });
  }); // end request

  request.write(requestBody);
  request.end();

  request.on('error', function(e) {
    callback({ success: false, error: e, message: 'Authentication failed. The request to exchange tokens failed.' });
  });
};
