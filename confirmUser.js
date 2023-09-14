const aws=require('aws-sdk');
const cognito= new aws.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
    try {
        const { email, confirmationCode } = JSON.parse(event.body)
 
        const client_id = process.env.COGNITO_CLIENT_ID;
        const params = {
            ConfirmationCode: confirmationCode,
            ClientId: client_id,
            Username: email
        }
        await cognito.confirmSignUp(params).promise();
        return sendResponse(200, { message: 'User email verified' })
    }
    catch (error) {
        console.error('Error during user confirmation:', error);
        const message = error.message ? error.message : 'Internal server error';
        console.log(`Error message ` + message );
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
  


  // a