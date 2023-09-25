const db = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.table_name;


exports.handler = async (event) => {
    try {
      const quizId = event.pathParameters.quizId;
  
      const params = {
        TableName: tableName,
        Key: {
          quizId: quizId,
        },
      };
  
      const quizDetails = await db.get(params).promise();
  
      if (!quizDetails.Item || !quizDetails.Item.users) {
        return sendResponse(404, { message: 'Quiz not found' });
      }
  
      // Filter users who attended the quiz
      const attendedUsers = quizDetails.Item.users.filter(user => user.attempted === 'Attempted');

      console.log("attendedUsers", attendedUsers);

      
  
      return sendResponse(200, { message: 'Users who attended the quiz', users: attendedUsers });
    } catch (error) {
      console.error('Error getting users who attended the quiz:', error);
      return sendResponse(500, { message: 'Error getting users who attended the quiz', error: error });
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
  