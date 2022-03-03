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

// image
const Upload = async (file, adsId) =>{
    const promises = [];
      file.forEach(i => {
          promises.push(
              new Promise((resolve, reject) => {
                  const blob = bucket.file(adsId+"/"+i.originalname.replace(/:/g, "-"));
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
                  .end(i.buffer)
              }).then(d => { return d })
          )
      })
      return promises
  }
  //delete
const Delete = async (adsId) => {
    await bucket.deleteFiles({ prefix: `${adsId}` });
};


module.exports = { Upload, Delete }