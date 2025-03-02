import fs from 'fs'

export function deleteFileWithPath(path) {
    return fs.unlink(path, (err) => {
        if (err) {
            return "file not deleted "
        } else {
            //  console.log(' File deleted:',path);
        }
    })
}