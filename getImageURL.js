const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const imageFileName = event.imageFileName; 

        const params = {
            Bucket: bucketName,
            Key: `images/${imageFileName}`, 
            Expires: 3600,
        };

        const imageUrl = await s3.getSignedUrl('getObject', params);

        return {
            statusCode: 200,
            body: JSON.stringify({ url: imageUrl }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error generating pre-signed URL'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};
