const db = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.table_name;

exports.handler = async (event) => {
    try {
      const quizId = event.pathParameters.quizId;
      const userId = event.pathParameters.userId;
  
      // Step 1: Fetch the current record for the quiz from QuizDetailsTable
      const quizDetailsParams = {
        TableName: tableName ,
        Key: {
          quizId: quizId,
        },
      };
  
      const quizDetails = await db.get(quizDetailsParams).promise();
      
  
      // Find the user's existing details in the quiz's "users" list
      const existingUserDetails = quizDetails.Item.users.find(user => user.userId === userId);

      console.log("user details", existingUserDetails);
  
      // Calculate the number of attempts
      let noOfAttempt = 0;
      if (existingUserDetails) {
        // If the user already exists, increment the number of attempts
        noOfAttempt = parseInt(existingUserDetails.noOfAttempt) + 1;

        
      console.log("noOfAttempt", noOfAttempt);
      } else {
        // If the user doesn't exist, it's their first attempt
        noOfAttempt = 1;
      }
  
    //   // Set the "attempted" attribute based on noOfAttempt
    //   const attempted = noOfAttempt >= 1 ? 'Attempted' : 'Unattempted';
  
      // Update or add user details in the quiz's "users" list
      const userDetails = {
        userId: userId,
        attempted: 'Attempted',
        noOfAttempt: noOfAttempt.toString(), // Convert to string before saving
      };
  
      if (existingUserDetails) {
        // Update the existing user's details
        const userIndex = quizDetails.Item.users.findIndex(user => user.userId === userId);

        console.log("nuserIndext", userIndex);

        quizDetails.Item.users[userIndex] = userDetails;
        
      } else {
        // Add the new user's details
        quizDetails.Item.users.push(userDetails);
      }
  
      // Step 2: Update the record in QuizDetailsTable with the updated "users" list
      const updateParams = {
        TableName: 'QuizDetailsTable',
        Key: {
          quizId: quizId,
        },
        UpdateExpression: 'SET users = :users',
        ExpressionAttributeValues: {
          ':users': quizDetails.Item.users,
        },
      };
  
      await docClient.update(updateParams).promise();
  
      return sendResponse(200, { message: 'User details added to quiz successfully' });
    } catch (error) {
      console.error('Error adding user details to quiz:', error);
      return sendResponse(500, { message: 'Error adding user details to quiz', error: error });
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
  