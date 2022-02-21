const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket_name = String(process.env.BUCKET_STORE_ADS)
const bucket = storage.bucket(bucket_name);

const Upload = (file, storeId , adsId) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(storeId+"/"+adsId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +file.originalname.replace(/:/g, "-"));
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

const Delete = async (storeId, adsId) => {
   return  await bucket.deleteFiles({ prefix: `${storeId}/${adsId}/`}, (err,files) => {
        if(err)
            return err
    });
}

const MultipleDelete = async(storeId, adsId) => {
    return await adsId.map( async i => {
        return await bucket.deleteFiles({ prefix: `${storeId}/${i}`}, (err,file) => {
            if(err){
                return {
                    status: 500,
                    message: "Store Ads Delete Error in Google Cloud Storage"
                }
            }
        })
    })
}


module.exports = { Upload, Delete , MultipleDelete}