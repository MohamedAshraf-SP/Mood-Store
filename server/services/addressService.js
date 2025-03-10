import {Address} from "../models/addresses.js";

class AddressService {
    // Create a new address
    // static async createAddress(data) {
    //     return await Address.create(data);
    // }

    // Get all addresses
    static async getAllAddresses() {
        return await Address.find();
    }
    static async getAllProvinces() {
        return await Address.find();
    }
    static async getAllCitiesOfProvince(Province) {
        return await Address.find({Province});
    }
    static async getAllAreasOfProvinceAndCity(Province,City) {
        return await Address.find({Province,City});
    }

    // Get a single address by ID
    // static async getAddressById(id) {
    //     return await Address.findById(id);
    // }

    // Update an address
    // static async updateAddress(id, data) {
    //     return await Address.findByIdAndUpdate(id, data, { new: true });
    // }
    static async disableAddress(Province,City,Area) {
        return await Address.updateOne({Province,City,Area},{$set:{enabled:"0"}})
    }
    static async enabledAddress(Province,City,Area) {
        return await Address.updateOne({Province,City,Area},{$set:{enabled:"1"}})
    }

    // Delete an address
    // static async deleteAddress(id) {
    //     return await Address.findByIdAndDelete(id);
    // }
}

export default AddressService;
