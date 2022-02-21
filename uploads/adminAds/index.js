const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket_name = String(process.env.BUCKET_ADMIN_ADS)
const bucket = storage.bucket(bucket_name);

const Upload = (file, adminId , adsId) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(adminId+"/"+adsId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +file.originalname.replace(/:/g, "-"));
        const blobStream = blob.createWriteStream({
            resumable: false
        });
        blobStream.on("finish", ()=> {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            resolve(publicUrl)
        })
        .on("error", () => {
            reject("Unable to upload image, something went wrong")
        })
        .end(file.buffer)
    }).then(d => { return d })
};

const Delete = async (adminId, adsId) => {
   return  await bucket.deleteFiles({ prefix: `${adminId}/${adsId}/`}, (err,files) => {
        if(err)
            return err
    });
}


module.exports = { Upload, Delete }