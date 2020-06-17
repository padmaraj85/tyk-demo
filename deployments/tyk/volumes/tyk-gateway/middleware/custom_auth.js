var custAuthPlugin = new TykJS.TykMiddleware.NewMiddleware({});
custAuthPlugin.NewProcessRequest(function (request, session, spec) {

  log("Cust Auth Plugin picked up...");

  log("Request Headers:" + JSON.stringify(request.Headers))
  //var authToken = request.Headers.Authorization;
  var authToken = request.Headers["Authorization"][0];

  // no token at all - return 401
  if (authToken == undefined) {

    request.ReturnOverrides.ResponseCode = 401
    request.ReturnOverrides.ResponseError = 'Header missing (JS middleware)'
    return custAuthPlugin.ReturnData(request, {});
  }

  //authToken = authToken.substring(7);
  //read config data from API definition
  var host = spec.config_data.auth_host;
  var path = spec.config_data.auth_path;
  var public_policy_id = spec.config_data.public_policy_id;
  var private_policy_id = spec.config_data.private_policy_id;

  log("Cust Auth Plugin Token :" + authToken);
  log("Cust Auth host :" + host);
  log("Cust Auth path :" + path);

  //configure a new request for token validation
  //change the value for path in config date to point to validate-private to simulate other flow
  newRequest = {
    "Method": "GET",
    "Body": "",
    "Headers": { "Authorization": JSON.stringify(request.Headers["Authorization"][0]) },
    "Domain": host,
    "Resource": path
  };

  log("Cust Auth req url: " + JSON.stringify(newRequest));

  // make the http request
  var response = TykMakeHttpRequest(JSON.stringify(newRequest));

  //read response
  usableResponse = JSON.parse(response);
  var respJson = JSON.parse(usableResponse.Body)
  var scope = respJson.scope;

  log("Response code: " + usableResponse.Code);
  log("Response body: " + usableResponse.Body);
  log("Response body scope: " + scope);

  //set policy id based on the scope
  var policyId = ((scope == "PUBLIC") ? public_policy_id : private_policy_id);
  log("Policy Id to be set: " + policyId);

  // Create a key with the policy, expires files can be updated according to the needs
  var thisSession = {
    //  "allowance": 100,
    //  "rate": 100,
    //  "per": 1,
    //  "quota_max": -1,
    //  "quota_renews": 1906121006,
    "expires": 1906121006,
    "apply_policies": [
      policyId
    ]
    // "access_rights": {
    //      "a8855706e9744dac5a1797e2c2f34d02": {
    //        "api_name": "disney",
    //        "api_id": "a8855706e9744dac5a1797e2c2f34d02",
    //        "versions": [
    //          "Default"
    //        ]
    //      }
    //    }
  };

  //put the key in Tyk's system
  TykSetKeyData(authToken, JSON.stringify(thisSession), 1);
  request.SetHeaders["Authorization"] = authToken;
  //return custAuthPlugin.ReturnAuthData(request, thisSession);
  return custAuthPlugin.ReturnData(request, {});

});


// Ensure init
log("Cust Auth plugin JS initialised...............");
