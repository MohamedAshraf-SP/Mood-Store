

import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
    Province: { type: String },
    City: { type: String },
    Area: { type: String },
    enabled: { type: String, required: true, default: "1" },
    shippingPrice: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now
    },

});



const senderSchema = new Schema({
    default: { type: Boolean, required: false, default: false },
    area: { type: String },
    street: { type: String },
    city: { type: String },
    mobile: { type: String },
    mailBox: { type: String },
    phone: { type: String },
    countryCode: { type: String },
    name: { type: String },
    company: { type: String },
    postCode: { type: String },
    prov: { type: String },
    areaCode: { type: String },
    building: { type: String },
    floor: { type: String },
    flats: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now
    },
});








addressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const Sender = model('Sender', senderSchema);
const Address = model('Address', addressSchema);
export { Sender, Address }


