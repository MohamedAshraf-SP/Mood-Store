import sharp from 'sharp';
import fs from 'fs/promises';

const resizeImageMiddleware = async (req, res, next) => {
    try {
        if (req.mainImage) {
            const mainImagePath = mainImage.path;
            mainImage.mimetype = 'image/webp'; // Path to the uploaded mainImage on disk
            const buffer = await fs.readFile(mainImagePath)
            const resizedImage = await sharp(buffer)
                .resize({ width: 400, height: 600 }) // Adjust dimensions as needed
                .toFormat('webp') // Convert to WebP format
                .toBuffer();

            // Replace the original mainImage buffer with the resized image
            await fs.writeFile(mainImagePath, resizedImage); // Overwrite the mainImage on disk
        }

        next();
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image.');
    }
};



const resizeImagesMiddleware = async (req, res, next) => {




    try {
        // Process each mainImage in the array
        if (req.files.images && req.files.images.length > 0) {
            req.files?.images.map(async (image) => {

                const imagePath = image.path;
                console.log(image.mimetype);
                image.mimetype = 'image/webp';

                // Path to the uploaded mainImage on disk
                const buffer = await fs.readFile(imagePath); // Read the mainImage into memory

                // Resize image to 4:3 aspect ratio (e.g., 800x600)
                const resizedImage = await sharp(buffer)
                    .resize({ width: 400, height: 500, fit: 'cover' }) // Adjust dimensions as needed
                    .toFormat('webp') // Convert to WebP format
                    .toBuffer();


                // Replace the original mainImage with the resized image
                await fs.writeFile(imagePath, resizedImage); // Overwrite the mainImage on disk
                // Update the mainImage's mimetype
            })
        }

        next();
    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).send('Error processing images.');
    }
};

export { resizeImageMiddleware, resizeImagesMiddleware };


