const aws = require('aws-sdk');
const cognito= new aws.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
    try {

        const { eMail, password } = JSON.parse(event.body);
        const user_pool_id = process.env.COGNITO_USER_POOL_ID;
        const client_id = process.env.COGNITO_CLIENT_ID;
        const params = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: user_pool_id,
            ClientId: client_id,
            AuthParameters: {
                USERNAME: eMail,
                PASSWORD: password
            }
        }
        const response = await cognito.adminInitiateAuth(params).promise();
        console.log(response);
        return sendResponse(200, {
            message: 'Success', refreshToken:
                response.AuthenticationResult.RefreshToken, token: response.AuthenticationResult.IdToken
        })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}


const sendResponse = (statusCode, body) => {
    const response = {
      statusCode: statusCode,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,Authorization,Content-Length,X-Request-With',
        'Access-Control-Allow-Credentials': true
      }
    };
    return response;
  };
  