
import { deleteFileWithPath } from "../../utils/helpers/deleteFile.js"
import { readCsvAsync } from "../../utils/helpers/importFormCSV.js"
import { Address } from "../../models/addresses.js"


export const importAddressesFromCSV = async (req, res) => {
    try {
        let pass = req.query.pass

        if ((pass != process.env.DIVA_API_SECRET)) {
            return res.status(403).json({ message: "cant do that!!!! " })
        }

        if (!req.file) {
            return res.status(400).json({ message: "File not found!!" })
        }

        let envLimit = parseInt(process.env.CSV_import_limit)
        let start = parseInt(req.query.start) || 1
        let end = parseInt(req.query.end) || envLimit

        //  console.log(req.query, end);


        if (start < 1 || start > envLimit || start > end) {
            start = 1
        }

        if (end < start || end > envLimit) {
            end = envLimit
        }



        const path = req.file.path

        const results = await readCsvAsync(`./${path}`)

        let loopEnd = end > results.length - 1 ? results.length : end

        for (let i = start; i <= loopEnd; i++) {
          //  console.log(results[i]);

            let newAddress = new Address({
                Province: results[i]['Gov'] || "-",
                City: results[i]['City'] || "-",
                Area: results[i]['Area'] || "-",
                shippingPrice: results[i]['shippingPrice'] || "-",
            })

            await newAddress.save()


            //   console.log(i);
        }

        deleteFileWithPath(`./${path}`)
        res.status(200).json({
            message: "success!!"
            , end
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ Error: ` ${e.message}` })
    }







}