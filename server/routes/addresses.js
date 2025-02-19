
import { importAddressesFromCSV } from "./../controllers/addresses/addressesFormCSV.js";
import { upload } from "../middlewares/multer.js";
import { Router } from 'express';

import { getAddresses, getAddressSeprated, updateStatus } from "./../controllers/addresses/addresses.js"
import { roleMiddleware } from "../middlewares/autherization.js";
const addressRoute = new Router()

//check if email exits


addressRoute.post('/importCSV', upload.single('addresses'), importAddressesFromCSV)
//Addresss
addressRoute.post('/seprated', getAddressSeprated);
addressRoute.post('/changestatus', updateStatus);
addressRoute.get('/', getAddresses);
// addressRoute.post('/', addAddress);
// addressRoute.put('/:id', updateAddress);
// addressRoute.delete('/:id', deleteAddress);


export default addressRoute

