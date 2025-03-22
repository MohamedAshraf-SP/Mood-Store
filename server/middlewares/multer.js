
import multer from 'multer'
import path from 'path'
import fs from "fs"


const urlParsingLastWord = (url) => {
    const match = url.match(/\/([^\/]+)\/?$/);
    const lastWord = match ? match[1] : 'default';
    return lastWord
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        req.lastWord = urlParsingLastWord(req.baseUrl || "")
        const uploadPath = `uploads/${req.lastWord}`

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively
        }



        cb(null, uploadPath); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
      req.pathx=  cb(
            null,
            '' + req.lastWord + "_" + Date.now() + "_" + file.originalname
        );
    }
});

export const upload = multer({ storage: storage });