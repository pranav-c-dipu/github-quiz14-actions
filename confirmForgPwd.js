

const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const client_id = process.env.COGNITO_CLIENT_ID;

module.exports.handler = async (event) => {
    try {
        const { email, confirmationCode, password } = JSON.parse(event.body)
        const client_id = process.env.COGNITO_CLIENT_ID;
        const params = {
            ConfirmationCode: confirmationCode,
            Password: password,
            ClientId: client_id,
            Username: email
        }
        const response = await cognito.confirmForgotPassword(params).promise();
        return sendResponse(200, { response });
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
  