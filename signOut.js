const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const user_pool_id = process.env.COGNITO_USER_POOL_ID;

module.exports.handler = async (event, context) => {
    try {
        
    // const authorizationHeader = event.headers['Authorization'];

    // const accessToken = authorizationHeader.split(' ')[1];

        
        const params = {
          Username: email,
          UserPoolId: user_pool_id

        };

        await cognito.adminUserGlobalSignOut(params).promise();
        return sendResponse(200,{success : true, message : 'Logout Completed successfully'});
    } catch (error) {
        console.error('Error during global signout:', error);
        return { success: false, message: 'Global signout failed.' };
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
  