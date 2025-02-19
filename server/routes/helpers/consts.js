
import { importAddressesFromCSV } from "../../controllers/addresses/addressesFormCSV.js";
import { upload } from "../../middlewares/multer.js";
import { Router } from 'express';

import { addHelper, updateHelper, getHelpers, deleteHelper, getHelperById, checkEmail } from "../../controllers/helpers/consts.js"
import { roleMiddleware } from "../../middlewares/autherization.js";
const helpersRoute = new Router()

//check if email exits
helpersRoute.post("/checkEmail", checkEmail)
helpersRoute.post('/importCSV', upload.single('addresses'), importAddressesFromCSV)


//helpers
helpersRoute.get('/consts/:id', getHelperById);          
helpersRoute.get('/consts', getHelpers);  
helpersRoute.post('/consts', addHelper);          
helpersRoute.put('/consts/:id', updateHelper);     
helpersRoute.delete('/consts/:id', deleteHelper);


export default helpersRoute

