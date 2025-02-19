

import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
    Province: { type: String },
    City: { type: String },
    Area: { type: String },
    enabled: { type: String, required: true, default: "1" },
    shippingPrice: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now
    },

});




addressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Address', addressSchema);


