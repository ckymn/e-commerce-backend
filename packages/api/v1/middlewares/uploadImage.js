const multer = require("multer");
const maxSize = 50 * 1024 * 1024;

const fileFilter = (req,file,cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" /*|| file.mimetype === "video/mp4"*/){
    cb(null,true);
  }else{
    cb(new Error("mimetype error"),false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  // dest:"./tempor",
  limits: {
    fileSize: maxSize // 10000000 Bytes = 10 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;