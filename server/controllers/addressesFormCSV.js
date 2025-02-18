
import { deleteFileWithPath } from "../utils/helpers/deleteFile.js"
import { readCsvAsync } from "../utils/helpers/importFormCSV.js"
import Address from "../models/addresses.js"


export const importAddressesFromCSV = async (req, res) => {
    try {
        let envLimit = parseInt(process.env.CSV_import_limit)
        let start = parseInt(req.query.start) || 1
        let end = parseInt(req.query.end) || envLimit

        console.log(req.query,end);


        if (start < 1 || start > envLimit || start > end) {
            start = 1
        }

        if (end < start || end > envLimit) {
            end = envLimit
        }


        if (!req.file) {
            return res.status(400).json({ message: "File not found!!" })
        }


        const path = req.file.path

        const results = await readCsvAsync(`./${path}`)
        console.log(results[1]);

        for (let i = start; i <= end; i++) {
            console.log(results[i]['Gov']);

            let newAddress = new Address({
                Province: results[i]['Gov'] || "-",
                City: results[i]['City'] || "-",
                Area: results[i]['Area'] || "-",
            })

            await newAddress.save()

           

        }

        deleteFileWithPath(`./${path}`)
        res.status(200).json({
            message: "success!!"
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ Error: ` ${e.message}` })
    }







}