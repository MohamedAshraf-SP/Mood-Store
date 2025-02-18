import mongoose from 'mongoose';

const helperSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

const Helper = mongoose.model('Helper', helperSchema);

export default Helper;
