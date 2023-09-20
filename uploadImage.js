const AWS = require('aws-sdk');
const s3 = new AWS.S3();



exports.handler = async (event) => {
    try {

        const bucket_name = process.env.AWS_S3_BUCKET_NAME;
        const base64Image = event.body; // The base64-encoded image data sent from the web app
        const contentType = event.headers['Content-Type']; // Get the content type from headers

        // Create a unique key for the S3 object (you can modify this as needed)
        const key = `images/${Date.now()}.${getFormatFromContentType(contentType)}`;

        // Decode the base64 image to binary data
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Define S3 upload parameters
        const params = {
            Bucket: bucket_name, // Replace with your S3 bucket name
            Key: key,
            Body: imageBuffer,
            ContentType: contentType, // Use the provided content type
            
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

// Function to extract the image format from the content type
function getFormatFromContentType(contentType) {
    switch (contentType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/gif':
            return 'gif';
        default:
            return 'jpg'; // Default to JPEG if content type is unknown
    }
}
