

import { Schema, model, mongoose } from 'mongoose';



const AddressSchema = new mongoose.Schema({
    area: String,
    street: String,
    address: String,
    addressBak: String,
    town: String,
    city: String,
    mobile: String,
    mailBox: String,
    phone: String,
    countryCode: String,
    name: String,
    alternateReceiverPhoneNo: String,
    company: String,
    postCode: String,
    prov: String,
    areaCode: String,
    building: String,
    floor: String,
    flats: String
});

const ItemSchema = new mongoose.Schema({
    englishName: String,
    number: Number,
    itemType: String,
    itemName: String,
    price: String,
    itemValue: String,
    chineseName: String,
    itemUrl: String,
    desc: String
});

const OrderSchema = new mongoose.Schema({

    txlogisticId: { type: String, required: true },
    customerCode: { type: String, required: true },
    billCode: { type: String, required: true },
    goodsType: { type: String, required: true },
    digest: { type: String, required: true },
    payType: { type: String, default: 'PP_PM' },
    expressType: { type: String, default: 'EZ' },
    deliveryType: { type: String, default: '04' },
    goodsType: { type: String, default: 'ITN16' },
    price: Number,
    length: Number,
    weight: Number,
    itemsValue: String,
    remark: String,
    operateType: { type: Number, enum: [1, 2] },
    totalQuantity: String,
    height: Number,
    width: Number,
    offerFee: Number,
    receiver: AddressSchema,
    sender: AddressSchema,
    items: [ItemSchema],
    confirmed:{ type: String, default: '0' },
    printed:{ type: String, default: '0' },
    deleted:{ type: String, default: '0' },

    // Shipping Provider Selection
    shippingProvider: { type: String, enum: ['JT', 'ACCURATE'], default: 'JT' },

    // Accurate Shipping Specific Fields
    accurateTrackingNumber: String,
    accurateShipmentId: String,
    accurateStatus: String,
    accurateShippingFees: Number

}, { timestamps: true });






OrderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Order', OrderSchema);



// add order generate class id for the order

// delete order

// update order

// get the number of orders



