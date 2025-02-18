import mongoose from 'mongoose';

// Connect to MongoDB using Mongoose
export async function run(uri) {
    try {
        console.log('\nConnecting to DB...\n');
        console.log(uri)
        // Connect to the MongoDB server
        await mongoose.connect(uri, {

        })
        console.log("Connected successfully to the database!\n");

        //const collections = await mongoose.connection.db.listCollections().toArray();

        // Log the collections
        // console.log("Collections in the database:");
        //collections.forEach(collection => console.log(collection.name));

    } catch (e) {
        console.error("DB connection error:", e);
    }
}

// Run the function to connect
