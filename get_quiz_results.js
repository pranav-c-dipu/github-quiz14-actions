const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.quiz_resultsDb;

exports.handler = async (event) => {


  try {
    const authorizationHeader = event.headers['Authorization'];
    const token = authorizationHeader.split(' ')[1];


    const params = {
      TableName: tableName,
      token: token
    };
    const response = await dynamoDB.scan(params).promise();
    console.log(response);
    return sendResponse(200, response);
  }
  catch (err) {
    console.log(err);
    response = err.message;
    return sendResponse(500, response);
  }
};

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
  