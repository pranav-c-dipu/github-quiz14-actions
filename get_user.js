const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const user_pool_id = process.env.COGNITO_USER_POOL_ID;


exports.handler = async (event) => {
  try{
    const { email} = JSON.parse(event.body);
    const params = {
        UserPoolId: user_pool_id,
        Username: email
    };
    const response = await cognito.adminGetUser(params).promise();
    const userAttributes = response.UserAttributes;
    
    const attributesObject = userAttributes.reduce((acc, attribute) => {
            acc[attribute.Name] = attribute.Value;
            return acc;
    }, {});
        
    const userInfo = {
            attributes: {
                ...attributesObject,
            },
            UserCreateDate: response.UserCreateDate,
            UserLastModifiedDate: response.UserLastModifiedDate,
            Enabled: response.Enabled,
            UserStatus: response.UserStatus
    };
        
    console.log(userInfo);
    return sendResponse(200, {userInfo});
  }catch (error) {
        const message = error.message ? error.message : 'Internal server error';
        return sendResponse(500, { message });
  }
};

const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':  '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,Authorization,Content-Length,X-Request-With',
            'Access-Control-Allow-Credentials': true
        }
    };
    return response;
};
