import {Address} from "../../models/addresses.js";
import AddressService from "../../services/addressService.js";
//import { handleError } from "../utils/errorHandler.js";

export const getAddressSeprated = async (req, res) => {
    try {
        const { Province, City } = req.body;
        let enabled = req.body.enabled || "1"
        // let price = req.body.address || "1"
        // console.log(Province, City);

        let result;
        let price;
        if (!Province) {
            result = await Address.find({ enabled }).distinct('Province');


            // console.log(result);// Select only the Province column
        } else if (!City) {
            result = await Address.find({ Province, enabled }).distinct('City');
            price = await Address.find({ Province, enabled }).distinct('shippingPrice');
            //    console.log(result); // Select only the City column
        } else {
            result = await Address.find({ Province, City, enabled }).distinct('Area');
            price = await Address.find({ Province, City, enabled }).distinct('shippingPrice');
            // Select only the Area column
        }

        res.status(200).json({ success: true, data: { result, price } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { Province, City, Area, enabled } = req.body;
        if (!Province || !City || !Area || !enabled) {
            return res.status(400).json({ success: false, message: "يرجي اكمال البيانات" });
        }

        const result = await Address.updateOne({ Province, City, Area }, { $set: { enabled } });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "العنوان موجود او تم ضبطه بالفعل !!" });
        }

        res.status(200).json({ success: true, message: `تم ${enabled === "1" ? "تفعيل" : "الغاء تفعيل"} العنوان بنجاح!!` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updatePriceOfProvince = async (req, res) => {
    try {
        const { Province, shippingPrice } = req.body;
        if (!Province || !shippingPrice) {
            return res.status(400).json({ success: false, message: "يرجي اكمال البيانات" });
        }

        const result = await Address.updateMany({ Province }, { $set: { shippingPrice } });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "العنوان موجود او تم ضبطه بالفعل !!" });
        }

        res.status(200).json({ success: true, message: `تم تحديث سعر الشحن  بنجاج الي ${shippingPrice} .` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all addresses
export const getAddresses = async (req, res) => {
    try {
        const addresses = await AddressService.getAllAddresses();
        res.status(200).json({ success: true, data: addresses });
    } catch (error) {
        //handleError(res, error);
    }
};


// Get address by ID
// export const getAddressById = async (req, res) => {
//     try {
//         const address = await AddressService.getAddressById(req.params.id);
//         if (!address) {
//             return res.status(404).json({ success: false, message: "Address not found" });
//         }
//         res.status(200).json({ success: true, data: address });
//     } catch (error) {
//         //handleError(res, error);
//     }
// };

// Update an address
// export const updateAddress = async (req, res) => {
//     try {
//         const updatedAddress = await AddressService.updateAddress(req.params.id, req.body);
//         if (!updatedAddress) {
//             return res.status(404).json({ success: false, message: "Address not found" });
//         }
//         res.status(200).json({ success: true, data: updatedAddress });
//     } catch (error) {
//         //handleError(res, error);
//     }
// };

// Delete an address
// export const deleteAddress = async (req, res) => {
//     try {
//         const deletedAddress = await AddressService.deleteAddress(req.params.id);
//         if (!deletedAddress) {
//             return res.status(404).json({ success: false, message: "Address not found" });
//         }
//         res.status(200).json({ success: true, message: "Address deleted successfully" });
//     } catch (error) {
//         //handleError(res, error);
//     }
// };
