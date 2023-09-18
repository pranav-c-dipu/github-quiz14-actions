const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.quiz_resultsDb;

exports.handler = async (event) => {
  try {
    
    const authorizationHeader = event.headers['Authorization'];

    const token = authorizationHeader.split(' ')[1];

    const body = JSON.parse(event.body);
    const { id, userId, userName, quizId, result } = body;

 
    const params = {
      TableName: tableName,
      token: token,
      Item: {
        id,
        userId,
        userName,
        quizId,
        result,
      },
    };

    await dynamoDB.put(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify('Data stored successfully in DynamoDB'),
    };

    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error storing data in DynamoDB'),
    };
  }
};


