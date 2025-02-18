
import crypto from 'crypto';


export const hashPassword = (password, secret = "jadada236t2") => {
    return crypto.createHash('md5').update(password + secret).digest('hex').toUpperCase();

}
export const generateBodyDigest = (customerCode, hashPass, privateKey) => {
    // Step 1: Create MD5 hash of the concatenated string
    const md5Hash = crypto.createHash('md5').update(customerCode + hashPass + privateKey).digest('hex');

    // Step 2: Convert the hex MD5 hash to binary (equivalent to pack('H*', ...))
    const binaryData = Buffer.from(md5Hash, 'hex');

    // Step 3: Encode the binary data to Base64 (equivalent to base64_encode)
    const base64Encoded = binaryData.toString('base64');

    return base64Encoded;
};
export const generateHeaderDigest = (body, privateKey) => {
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
export const generateID = () => {
    return "SYS-"+Math.floor(Math.random() * 1000000000)
}