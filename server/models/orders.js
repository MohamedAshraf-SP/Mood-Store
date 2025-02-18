

import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    orderName: { type: String, required: true },
    password: {
        type: String, required: true,
        default: function () {
            return this.generatePassword()
        }
    },
    orderRole: {
        type: String,
        enum: [
            'admin',
            'user',
        ],
        required: true
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now
    },

});




orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Order', orderSchema);



// add order generate class id for the order

// delete order

// update order

// get the number of orders