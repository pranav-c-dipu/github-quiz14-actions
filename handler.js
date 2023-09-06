const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();


const tableName = process.env.table_name;

exports.getallQuiz = async (event) => {

  try {
    console.log(JSON.stringify(event));

    const quizId = event.queryStringParameters.quizId;



    const params = {
      TableName: tableName,
      FilterExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId
      }
    };

    const response = await db.scan(params).promise();
    return sendResponse(200, response);
  } catch (err) {
    console.error(err);


    return sendResponse(400, { error: err.message });
  }
};




exports.createQuiz = async (event) => {
  const Body = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Item: {
      quizId: Body.quizId,
      questions: Body.questions,
      quizName: Body.quizName,
    },
  };

  try {

    await db.put(params).promise();
    return sendResponse(200, { message: 'Quiz data saved successfully' });

  }
  catch (error) {
    console.error('Error saving quiz data:', error);
    return sendResponse(500, { message: 'Error saving quiz data', error: error });

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
