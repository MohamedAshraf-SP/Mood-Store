
import { importAddressesFromCSV } from "./../controllers/addresses/addressesFormCSV.js";
import { upload } from "../middlewares/multer.js";
import { Router } from 'express';

import { getAddresses, getAddressSeprated, updateStatus, updatePriceOfProvince } from "./../controllers/addresses/addresses.js"
import { roleMiddleware } from "../middlewares/autherization.js";
import senderRouter from "./senderAddresses.js";
const addressRoute = new Router()

//check if email exits


addressRoute.use("/senders", senderRouter)
addressRoute.post('/importCSV', upload.single('addresses'), importAddressesFromCSV)
addressRoute.post('/seprated', getAddressSeprated);
addressRoute.post('/changestatus', updateStatus);
addressRoute.put('/change_shipping_price', updatePriceOfProvince);
addressRoute.get('/', getAddresses);
// addressRoute.post('/', addAddress);
// addressRoute.put('/:id', updateAddress);
// addressRoute.delete('/:id', deleteAddress);


export default addressRoute

