

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userName: { type: String, required: true ,unique:true},
    password: {
        type: String, required: true,
        default: function () {
            return this.generatePassword()
        }
    },
    userRole: {
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


userSchema.methods.generatePassword = function () {
    // Generate a 3-digit number (e.g., between 1000 and 9999)
    return Math.floor(Math.random() * 9087028200);
};

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('User', userSchema);



// add user generate class id for the user

// delete user

// update user

// get the number of users