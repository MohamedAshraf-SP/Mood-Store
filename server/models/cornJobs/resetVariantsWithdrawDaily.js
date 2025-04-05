import cron from 'node-cron';
import { Product } from '../products.js'; // Adjust the import path as necessary

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily reset for dayWithdraw...');

        // Update all variants' dayWithdraw to 0
        await Product.updateMany(
            {}, // Match all products
            { $set: { 'variants.$[].dayWithdraw': 0 } } // Reset dayWithdraw for all variants
        );

        console.log('Successfully reset dayWithdraw for all products.');
    } catch (error) {
        console.error('Error resetting dayWithdraw:', error);
    }
});