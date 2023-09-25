const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();


const tableName = process.env.table_name;

exports.getAllQuiz = async (event) => {


  try {
    const authorizationHeader = event.headers['Authorization'];
    const token = authorizationHeader.split(' ')[1];


    const params = {
      TableName: tableName,
      token: token
    };
    const response = await db.scan(params).promise();
    return sendResponse(200, response);
  }
  catch (err) {
    console.log(err);
    response = err.message;
    return sendResponse(500, response);
  }
};

exports.getQuiz = async (event) => {

  try {
    console.log(JSON.stringify(event));

    const authorizationHeader = event.headers['Authorization'];

    const token = authorizationHeader.split(' ')[1];

    const quizId = event.pathParameters.quizId;



    const params = {
      TableName: tableName,
      token: token,
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

exports.getQuizAdmin = async (event) => {

  try {
    console.log(JSON.stringify(event));

    // const authorizationHeader = event.headers['Authorization'];

    // const token = authorizationHeader.split(' ')[1];

  

    // const userId = event.queryStringParameters.userID;

  // const userId = event.pathParameters.userID;

    const params = {
      TableName: tableName,
      token: token,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId 
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

  try {
    const authorizationHeader = event.headers['Authorization'];


    const token = authorizationHeader.split(' ')[1];

    const userID = event.pathParameters.userID;


  const Body = JSON.parse(event.body);

  const users = [];

  const params = {
    TableName: tableName,
    token: token,
    Item: {
      quizId: Body.quizId,
      questions: Body.questions,
      quizName: Body.quizName,
      userId: userID,
      users: users, //  empty "users" list 
    },
  };

 

   const response =  await db.put(params).promise();
    return sendResponse(200, { message: 'Quiz data saved successfully',response });

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
