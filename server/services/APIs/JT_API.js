
import crypto from 'crypto';
import axios from 'axios'
import { get } from 'http';
import { generateBodyDigest, generateHeaderDigest, generateID, hashPassword } from '../../utils/generators/generators.js';
import dotenv from 'dotenv';
// const customerCode = "J0086004385";
// const password = "Jt123456";
// const apiAccount = "663390130932817921";
// const private_key = "20180ff83ca04442840339c682f951b5";

dotenv.config()

//ragab
const customerCode = process.env.CUSTOMER_CODE
const password = process.env.PASSWORD
const apiAccount = process.env.API_ACCOUNT
const private_key = process.env.PRIVATE_KEY


export const generateJTCreateRequestBody = (requestData, itemsData = requestData.items) => {
    return {
        txlogisticId: generateID(), // Dynamic store ID from frontend
        customerCode: customerCode, // Static value

        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback

        payType: "PP_CASH", // Static
        expressType: "EZ", // Static
        deliveryType: "04", // Static (Home Delivery)
        goodsType: requestData.goodsType || "ITN16", // Static (Others)

        length: requestData.length || 30, // Use default if not provided
        weight: requestData.weight || 1, // Default weight
        itemsValue: requestData.itemsValue || "",
        remark: requestData.remark || "-",

        invoceNumber: requestData.invoceNumber || "231321354564654", // Dynamic
        packingNumber: requestData.packingNumber || "1313213254564564df", // Dynamic
        batchNumber: requestData.batchNumber || "",
        billCode: requestData.billCode || "-",
        operateType: requestData.operateType || 1, // 1 = Adding, 2 = Updating

        sendStartTime: requestData.sendStartTime || "2022-03-17 14:53:44",
        sendEndTime: requestData.sendEndTime || "2022-03-18 14:53:44",
        expectDeliveryStartTime: requestData.expectDeliveryStartTime || "2022-09-07 14:53:44",
        expectDeliveryEndTime: requestData.expectDeliveryEndTime || "2022-09-08 14:53:44",
        totalQuantity: requestData.totalQuantity || "1",
        height: requestData.height || 60,

        receiver: {
            area: requestData.receiver?.area || "القاهرة",
            street: requestData.receiver?.street || "D",
            address: requestData.receiver?.address || "kkk",
            addressBak: requestData.receiver?.addressBak || "FFF",
            town: requestData.receiver?.town || "ll",
            city: requestData.receiver?.city || "مدينة نصر",
            mobile: requestData.receiver?.mobile || "01099075241",
            mailBox: requestData.receiver?.mailBox || "ant_li123@qq.com",
            phone: requestData.receiver?.phone || "034351203",
            countryCode: "EGY",
            name: requestData.receiver?.name || "HAGER",
            alternateReceiverPhoneNo: requestData.receiver?.alternateReceiverPhoneNo || "12-31321322",
            company: requestData.receiver?.company || "JT",
            postCode: requestData.receiver?.postCode || "54830",
            prov: requestData.receiver?.prov || "القاهرة",
            areaCode: requestData.receiver?.areaCode || "A0003324",
            building: requestData.receiver?.building || "13",
            floor: requestData.receiver?.floor || "25",
            flats: requestData.receiver?.flats || "47"
        },

        sender: {
            area: requestData.sender?.area || "stade",
            street: requestData.sender?.street || "1",
            city: requestData.sender?.city || "tanta",
            mobile: requestData.sender?.mobile || "01000000000",
            mailBox: requestData.sender?.mailBox || "a@b.com",
            phone: requestData.sender?.phone || "01000000000",
            countryCode: "EGY",
            name: requestData.sender?.name || "Mody Store",
            company: requestData.sender?.company || "JT",
            postCode: requestData.sender?.postCode || "16880",
            prov: requestData.sender?.prov || "البحيرة",
            areaCode: requestData.sender?.areaCode || "1",
            building: requestData.sender?.building || "1",
            floor: requestData.sender?.floor || "1",
            flats: requestData.sender?.flats || "1"
        },

        width: requestData.width || 11,
        offerFee: requestData.offerFee || 1,

        items: itemsData || []
    }
};

export const generateJTCancelRequestBody = (requestData) => {
    return {
        txlogisticId: requestData.txlogisticId, // Dynamic store ID from frontend
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        reason: requestData.reason || "-",
        orderType: "1", // Static
    }
};
export const generateTrackRequestBody = (requestData) => {
    return {
        billCodes: requestData.billCodes
    }
};
export const generateJTPrintRequestBody = (requestData) => {
    return {
        billCode: requestData.billCode, // Dynamic store ID from frontend
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        printSize: requestData.printSize || 0,
        printCod: requestData.printCod || 0,
        showCustomerOrderId: requestData.showCustomerOrderId || 1,//Print the barcode of the customer order number or not，
        //  value 0 or null refers to not print 
        //  value 1 refers to print
    }
};
export const generateJTGetOrdersRequestBody = (requestData) => {
    return {
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        command: requestData.command || 3,
        serialNumber: requestData.serialNumber || [],
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        status: requestData.status, //Status 
        // (the order status is taken from the status table below, filtered data is used, all by default):
        //  canceled 104; 
        //  picked up 103;
        //  dispatched salesperson 102;
        //  dispatched outlets 101;
        //  not dispatched 100
        current: requestData.current, //#current page
        size: requestData.size, //#of return records
    }
};


export const OrderRequest = async (path, generatedBody) => {
    let body = JSON.stringify(generatedBody)
    const data = { bizContent: (JSON.stringify(generatedBody)) }
    try {
        const res = await axios.post(
            `https://openapi.jtjms-eg.com/webopenplatformapi/api${path}`,
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "apiAccount": apiAccount,
                    "digest": generateHeaderDigest(body, private_key),
                    "timestamp": Math.floor(Date.now() / 1000)
                }
            })


        console.log(res.data, path);
        return res
    } catch (e) {
        console.log(e.message);
    }
}