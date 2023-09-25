const db = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.table_name;

exports.handler = async (event) => {
  try {
  
    const userId = event.pathParameters.userId;

    const params = {
      TableName: tableName
    };

    const scanResult = await db.scan(params).promise();

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return sendResponse(404, { message: 'No quizzes found' });
    }

   
    const attemptedQuizzes = [];
    const nonAttemptedQuizzes = [];

    scanResult.Items.forEach(quiz => {
   
      const userAttempt = quiz.users.find(user => user.userId === userId);

      console.log("userAttempt",userAttempt);

      if (userAttempt && userAttempt.attempted === 'Attempted') {
        attemptedQuizzes.push(quiz);
      } else {
        nonAttemptedQuizzes.push(quiz);
      }
    });

    return sendResponse(200, {
      attemptedQuizzes: attemptedQuizzes,
      nonAttemptedQuizzes: nonAttemptedQuizzes
    });
  } catch (error) {
    console.error('Error retrieving quizzes:', error);
    return sendResponse(500, { message: 'Error retrieving quizzes', error: error });
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