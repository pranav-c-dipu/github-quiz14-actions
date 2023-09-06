const aws=require('aws-sdk');
const cognito= new aws.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
    try {
       
        let { email, name, country, phone_number, password, birthdate } = JSON.parse(event.body);
        console.log(event.body);
        groupName = "USER";
        const { user_pool_id, client_id } = process.env;
        console.log(user_pool_id);
        const params = {
            ClientId: client_id,
            Password: password,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'phone_number',
                    Value: phone_number
                },
                {
                    Name: 'custom:country',
                    Value: country
                },
                {
                    Name: 'custom:group',
                    Value: groupName
                },
                {
                    Name: 'birthdate',
                    Value: birthdate
                }
            ],
            // MessageAction: 'SUPPRESS'
        }
        const response = await cognito.signUp(params).promise();
        console.log(response);
        const paramsForGroup = {
            GroupName: groupName,
            UserPoolId: user_pool_id,
            Username: email
        }
        const addUsertoGroup = await
            cognito.adminAddUserToGroup(paramsForGroup).promise();
        console.log(addUsertoGroup);
        return sendResponse(200, { message: 'User registration successful' })
    }
    catch (error) {
        console.error("cloudwatch log", error);
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
  