// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https'),
    jwt = require('jwt-simple'),
    jws = require('jws'),
    clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
    clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY',
    googleCertificates = [];

// Get the Google Certificates to validate OpenID Connect id_tokens
//
// https://www.googleapis.com/oauth2/v1/certs
var certRequest = https.request({
  hostname: 'www.googleapis.com',
  path: '/oauth2/v1/certs',
  method: 'GET'
}, function(certResponse) {

  var certResponseText = '';

  certResponse.on('data', function (chunk) {
    certResponseText = certResponseText + chunk;
  });

  certResponse.on('end', function () {
    // The response contains a certificate like this
    // {
    //  "2784873a666fc894d6c724df0c26c6296493e758": "-----BEGIN CERTIFICATE-----\nMIICITCCAYqgAwIBAgIIN5YrSIb+nWIwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0xNDAzMDkwNjI4MzRaFw0xNDAzMTAxOTI4MzRaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wgZ8wDQYJKoZI\nhvcNAQEBBQADgY0AMIGJAoGBALB5HLJsOF9hdSUU0B2uiyWsUmKCuqQJaExp7DML\npjgDJV92+iVdHcu1mHtuB2LnzgwlOkOJp9g7YeUoU+HhX2bFVXVz5R5z1vyeApKq\n6/MnRym2XcZsi0IqEDPU8IA3ZdL2P4a/qRpAgTkVLGOXLVAe/FTpDKQ68acvj5Yq\nXKCNAgMBAAGjODA2MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1Ud\nJQEB/wQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4GBADGj8G6orcSjCznR\nUwlJ9DCoDKTJkv4W6vaRp70hbSIloBpZIfohicx19ARyxwq3R4r8kEjHS5XDIdi/\nNi1IBXCZRdpHk9z8OlyIV86uWDYoJz0vzthL/apDyIgGRxi6Pf9gGJYAHavt5TEk\n6pXqbd4LAJXuFCzBAkoorjzWn0Vx\n-----END CERTIFICATE-----\n",
    //  "c98f8f084aea475bea45c614e947dfbd10310199": "-----BEGIN CERTIFICATE-----\nMIICITCCAYqgAwIBAgIIXWYbNFqgWPAwDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0xNDAzMTAwNjEzMzRaFw0xNDAzMTExOTEzMzRaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wgZ8wDQYJKoZI\nhvcNAQEBBQADgY0AMIGJAoGBAMKR9OmUxfa6wlcLy1X0NhL4FahUiGoXQFWysHwK\nrQu6Vd1THU6CtjZx52TWXI0kIyMUHdHMu5766VACq371dKGCmvKsbenC0MsIZXvr\nK89NP5nbaNs27oADKblf2fw/zFuJdQpIH6fvSLwOv96DyyaUHOk6T+8zSrb7uoTt\nXIwnAgMBAAGjODA2MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1Ud\nJQEB/wQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4GBADs5vypzOwHKddWY\nQXJEYgLkgeuMzrCP4t3MJfquDFqC0aFroRY9fkqIe6s1V8hF2ddziIWTcE0x6Z99\nvBzDlUegrIvl6L+2ibGVByAN1n5B1oH8EfgnuK1kfEhvmAeeX/mh3PISTX85gpUi\nxBgf7bbbROvWuauTPPuvkJhNerXo\n-----END CERTIFICATE-----\n"
    // }
    var certificates = JSON.parse(certResponseText);

    for (var key in certificates) {
      if (certificates.hasOwnProperty(key)) {
        googleCertificates.push(certificates[key]);
      }
    }
  });
});
certRequest.end();
certRequest.on('error', function() {
  // Just don't blow up!
});




// Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token.
module.exports.createOAuthToken = function createOAuthToken(req, res) {

  // The user has granted access to suri from Google and the callback returned a one-time authorization
  // code. We need to exchange the code for an OAuth access_token and OpenID Connect id_token.
  //
  // 4. https://developers.google.com/accounts/docs/OAuth2Login#exchangecode
  //
  // POST https://accounts.google.com/o/oauth2/token
  var accessTokenRequestOptions = {
    hostname: 'accounts.google.com',
    path: '/o/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var accessTokenRequestBody = 'client_id=' + clientId +
                    '&client_secret=' + clientSecret +
                    '&code=' + req.body.code +
                    '&grant_type=authorization_code' +
                    '&redirect_uri=' + req.body.redirectUri;

  var accessTokenRequest = https.request(accessTokenRequestOptions, function(accessTokenResponse) {

    var accessTokenResponseText = '';

    accessTokenResponse.on('data', function (chunk) {
      accessTokenResponseText = accessTokenResponseText + chunk;
    });

    accessTokenResponse.on('end', function () {
      // Obtain user information from the ID token
      //
      // 5. https://developers.google.com/accounts/docs/OAuth2Login#obtainuserinfo
      var accessTokenResponseJson = JSON.parse(accessTokenResponseText);

      // Validate the id_token against Google's certificates
      //
      // https://www.googleapis.com/oauth2/v1/certs
      //
      // We have to use jws to verify because jwt doesn't support RS256. We have to use jwt to decode
      // because jws doesn't deserialize the payload. It only decodes it from base64. Arg!
      var verified = false;
      for (var i = 0; i < googleCertificates.length; i++) {
        try {
          if (jws.verify(accessTokenResponseJson.id_token, googleCertificates[i])) {
            verified = true;
            break;
          }
        } catch (e) {}
      }
      if (!verified) {
        res.send(401, { message: 'Authentication failed. The id_token signature did not verify against the certificate.' });
      }

      accessTokenResponseJson.decoded_id_token = jwt.decode(accessTokenResponseJson.id_token, {}, true);

      // Validate the id_token aud and iss
      //
      // https://developers.google.com/accounts/docs/OAuth2Login#validatinganidtoken
      if (accessTokenResponseJson.decoded_id_token.aud !== clientId || accessTokenResponseJson.decoded_id_token.iss !== 'accounts.google.com') {
        res.send(401, { message: 'Authentication failed. The id_token.aud does not match the client ID.' });
      }

      // Create a suri session for the user
      //
      // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
      //
      // TODO: ???

      res.send(201, JSON.stringify(accessTokenResponseJson));

    });
  }); // end accessTokenRequest

  accessTokenRequest.write(accessTokenRequestBody);
  accessTokenRequest.end();

  accessTokenRequest.on('error', function(e) {
    res.send(401, e);
  });

};
