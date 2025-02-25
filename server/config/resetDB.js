import mongoose from "mongoose";

export const deleteAllCollections = async (req, res) => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }
    res.status(200).json({ message: "All collections deleted successfully." })

    console.log();

}