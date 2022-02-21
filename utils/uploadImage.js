const multer = require("multer");

const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "video/mp4"){
        cb(null,true)
    }else{
        cb(new Error("mimetype error"),false);
    }
}
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
})

module.exports = upload;