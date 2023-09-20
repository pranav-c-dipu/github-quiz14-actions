const AWS = require('aws-sdk');
const s3 = new AWS.S3();



exports.handler = async (event) => {
    try {

        const bucket_name = process.env.AWS_S3_BUCKET_NAME;
        const base64Image = event.body; 
        const contentType = event.headers['Content-Type'];

      
        const key = `images/${Date.now()}.${getFormatFromContentType(contentType)}`;

      
        const imageBuffer = Buffer.from(base64Image, 'base64');

       
        const params = {
            Bucket: bucket_name, 
            Key: key,
            Body: imageBuffer,
            ContentType: contentType, 
            
        };

      
        await s3.putObject(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify('Image uploaded successfully'),
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
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Image upload failed'),headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers':
                  'Content-Type,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,Authorization,Content-Length,X-Request-With',
                'Access-Control-Allow-Credentials': true
              }
        };
    }
};

function getFormatFromContentType(contentType) {
    switch (contentType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/gif':
            return 'gif';
        default:
            return 'jpg'; 
    }
}
