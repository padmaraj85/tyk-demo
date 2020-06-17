function validatePublicToken(request, session, config) {

    var data  =  {
	"token_ttl": 763,
	"scope": "PUBLIC",
	"client_id": "TYK-TEST"
};

  var responseObject = {
    Body: JSON.stringify(data),
     Headers: {
      "Content-Type": "application/json"
    },
    Code: 200
  }
  return TykJsResponse(responseObject, session.meta_data)
}

function validatePrivateToken(request, session, config) {

    var data  =  {
	"token_ttl": 763,
	"scope": "PRIVATE",
	"client_id": "TYK-TEST"
};

  var responseObject = {
    Body: JSON.stringify(data),
    Headers: {
      "Content-Type": "application/json"
    },
    Code: 200
  }
  return TykJsResponse(responseObject, session.meta_data)
}


function tokenGen(request, session, config) {
 var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 15; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   var data  =  {
 "access_token": result,
 "token_type": "bearer",
 "expires_in": 899,
 "scope": "AUTHZ_PUBLIC-INSECURE",
 "assertion_type": "public"
};

  var responseObject = {
    Body: JSON.stringify(data),
    Headers: {
      "Token": result,
      "x-test-2": "virtual-header-2",
      "Content-Type": "application/json"
    },
    Code: 200
  }
  return TykJsResponse(responseObject, session.meta_data)

}
