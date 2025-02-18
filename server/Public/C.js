

import crypto from 'crypto';
import axios from 'axios'
import { get } from 'http';
// const customerCode = "J0086004385";
// const password = "Jt123456";
// const apiAccount = "663390130932817921";
// const private_key = "20180ff83ca04442840339c682f951b5";


//ragab
const customerCode = "J0086006972";
const password = "Rr1131054";
const apiAccount = "749605792625197074";
const private_key = "7df288816cf642debd114ca3764b7539";


let createReqBody =  {
    'customerCode': 'J0086006972',
    'digest': '7hqaqXhUvgOh5btHVuvoGA==',
    'deliveryType': '04',
    'payType': 'PP_PM',
    'expressType': 'EZ',
    'network': '',
    'length': 30,
    'sendStartTime': '2022-03-17 14:53:44',
    'weight': 5.02,
    'itemsValue': '',
    'remark': 'test',
    'invoceNumber': '231321354564654',
    'packingNumber': '1313213254564564df',
    'batchNumber': '',
    'txlogisticId': 'test123',
    'billCode': '',
    'operateType': 1,
    'expectDeliveryStartTime': '2022-09-07 14:53:44',
    'expectDeliveryEndTime': '2022-09-08 14:53:44',
    'goodsType': 'ITN1',
    'totalQuantity': '1',
    'receiver': {
        'area': 'القاهرة',
        'street': 'D',
        'address': 'kkk',
        'addressBak': 'FFF',
        'town': 'll',
        'city': 'مدينة نصر',
        'mobile': '01099075241',
        'mailBox': 'ant_li123@qq.com',
        'phone': '034351203',
        'countryCode': 'EGY',
        'name': 'HAGER',
        'alternateReceiverPhoneNo': '12-31321322',
        'company': 'JT',
        'postCode': '54830',
        'prov': 'القاهرة',
        'areaCode': 'A0003324',
        'building': '13',
        'floor': '25',
        'flats': '47',
    },
    'sender': {
        'area': 'الإسكندرية',
        'street': 'jjj',
        'city': 'المنتزه',
        'mobile': '01099075241',
        'mailBox': 'ant_DY@qq.com',
        'phone': '01099075241',
        'countryCode': 'MEX',
        'name': 'MAGDY',
        'company': 'JT',
        'postCode': '16880',
        'prov': 'الإسكندرية',
        'areaCode': 'A0002237',
        'building': '13',
        'floor': '25',
        'flats': '47'
    },
    'width': 10,
    'offerFee': 1,
    'items': [{
        'englishName': 'test',
        'number': 1,
        'itemType': 'ITN16',
        'itemName': 'file type',
        'priceCurrency': 'DHS',
        'itemValue': '',
        'chineseName': 'test_order',
        'itemUrl': 'http://www.baidu.com',
        'desc': 'test_order'
    },
    {
        'englishName': 'test',
        'number': 1,
        'itemType': 'ITN16',
        'itemName': 'testy',
        'priceCurrency': 'DHS',
        'chineseName': 'test_order',
        'itemUrl': 'http://www.baidu.com',
        'desc': 'test_order'
    }],
    'sendEndTime': '2022-03-18 14:53:44',
    'height': 60
}
let cancelReqBody={
    'txlogisticId': 'SYS-420270965',
    'customerCode': 'J0086006972',
}
let printReqBody={
    'billCode': 'JEG000280941897',
    'customerCode': 'J0086006972',
    'printCod':0,
    'printSize':0,
    'showCustomerOrderId':0,
}

let getOrdersReqBody={
        'customerCode':'J0086006972',
        'digest': '7hqaqXhUvgOh5btHVuvoGA==',
        'command': 3,
        'serialNumber': [],
        'startDate': '2025-02-06 00:00:00',
        'endDate': '2025-02-13 23:59:59',
        'status': 101,
        'current': 1,
        'size': 50 
}



const hashPassword = (password, secret = "jadada236t2") => {
    return crypto.createHash('md5').update(password + secret).digest('hex').toUpperCase();

}
const generateBodyDigest = (customerCode, hashPass, privateKey) => {
    // Step 1: Create MD5 hash of the concatenated string
    const md5Hash = crypto.createHash('md5').update(customerCode + hashPass + privateKey).digest('hex');

    // Step 2: Convert the hex MD5 hash to binary (equivalent to pack('H*', ...))
    const binaryData = Buffer.from(md5Hash, 'hex');

    // Step 3: Encode the binary data to Base64 (equivalent to base64_encode)
    const base64Encoded = binaryData.toString('base64');

    return base64Encoded;
};
const generateHeaderDigest = (body, privateKey) => {
    let bodyString = body// JSON.stringify(body).replaceAll(" ", "").replaceAll("\n", "")
    // console.log(bodyString);
    // Step 1: Create MD5 hash of the concatenated string
    const md5Hash = crypto.createHash('md5').update(bodyString + privateKey).digest('hex').toUpperCase();

    // Step 2: Convert the hex MD5 hash to binary (equivalent to pack('H*', ...))
    const binaryData = Buffer.from(md5Hash, 'hex');

    // Step 3: Encode the binary data to Base64 (equivalent to base64_encode)
    const base64Encoded = binaryData.toString('base64');

    return base64Encoded;
};
const generateID = () => {
    return "SYS-"+Math.floor(Math.random() * 1000000000)
}
const generateJTCreateRequestBody = (requestData, itemsData = requestData.items) => {
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
        billCode: requestData.billCode || "",
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
            prov: requestData.sender?.prov || " ",
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

const generateJTCancelRequestBody = (requestData) => {
    return {
        txlogisticId: requestData.txlogisticId, // Dynamic store ID from frontend
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        reason: requestData.reason || "-",
        orderType: "1", // Static
    }
};
const generateJTPrintRequestBody = (requestData) => {
    return {
        billCode: requestData.billCode, // Dynamic store ID from frontend
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        printSize: requestData.printSize || 0,
        printCod: requestData.printCod || 0,
        showCustomerOrderId:requestData.showCustomerOrderId|| 1,//Print the barcode of the customer order number or not，
                                                    //  value 0 or null refers to not print 
                                                    //  value 1 refers to print
}
};
const generateJTGetOrdersRequestBody = (requestData) => {
    return {
        customerCode: customerCode, // Static value
        digest: generateBodyDigest(customerCode, hashPassword(password), private_key), // Optional dynamic, default fallback
        command: requestData.command||3,
        serialNumber: requestData.serialNumber||[],
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


/////////testing////////


const dynamicCreateBody = generateJTCreateRequestBody(createReqBody, createReqBody.items);
const dynamicCancelBody = generateJTCancelRequestBody(cancelReqBody);
const dynamicGetOrdersBody = generateJTGetOrdersRequestBody(getOrdersReqBody);
const dynamicPrintBody = generateJTPrintRequestBody(printReqBody);



console.log("Body   digest:", generateBodyDigest(customerCode, hashPassword(password), private_key));
console.log("Header digest:", generateHeaderDigest(dynamicCancelBody, private_key), "\n");







const OrderRequest=async(path,generatedBody)=>{
    let body = JSON.stringify(generatedBody)
    const data = { bizContent: (JSON.stringify(generatedBody)) }
    try {
        const res = await axios.post(
            `https://openapi.jtjms-eg.com/webopenplatformapi/api/order${path}`,
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "apiAccount": apiAccount,
                    "digest": generateHeaderDigest(body, private_key),
                    "timestamp": Math.floor(Date.now() / 1000)
                }
            })
    
    
        console.log(res.data,path);
        return res
    } catch (e) {
        console.log(e.message);
    }
}


OrderRequest('/addOrder',dynamicCreateBody)
OrderRequest('/cancelOrder',dynamicCancelBody)
OrderRequest('/printOrder',dynamicPrintBody)
OrderRequest('/getOrders',dynamicGetOrdersBody)

//Query command 
// 1. Query by customer order number
// 2. Query by waybill number (check order status with waybill number) 
// 3. Query by time period of order (check order) (query by time period returns unlimited number) 
// 4. Order serial number


//command=1 customer order number query;
// command=2 waybill number temporarily; 
// command=4 order number (internal company) supports 200; 
// Command=1, 2 or 3 is required
