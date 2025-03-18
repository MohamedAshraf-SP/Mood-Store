import mongoose from "mongoose";

export const deleteAllCollections = async (req, res) => {
    let pass = req.query.pass
    if ((pass != process.env.DIVA_API_SECRET)) {
        return res.status(403).json({ message: "cant do that!!!!!!!!!! " })
    }
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }
    res.status(200).json({ message: "All collections deleted successfully." })

    console.log();

}