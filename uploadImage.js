const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const base64Image = event.body; // The base64-encoded image data sent from Flutter
        
        // Create a unique key for the S3 object (you can modify this as needed)
        const key = `images/${Date.now()}.jpg`;
        
        // Decode the base64 image to binary data
        const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');
        
        // Define S3 upload parameters
        const params = {
            Bucket: 'YOUR_S3_BUCKET_NAME', // Replace with your S3 bucket name
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/jpeg', // Modify the content type if needed
            ACL: 'public-read', // Make the uploaded image public or private as needed
        };
        
        // Upload the image to S3
        await s3.putObject(params).promise();
        
        // Respond with a success message
        const response = {
            statusCode: 200,
            body: JSON.stringify('Image uploaded successfully'),
        };
        return response;
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Image upload failed'),
        };
    }
};
