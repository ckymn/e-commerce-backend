const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket = storage.bucket(String(process.env.BUCKET_ADMIN_BANNERS));

// image
const Upload = async (file, bnrId) =>{
  const promises = [];
    file.forEach(i => {
        promises.push(
            new Promise((resolve, reject) => {
                const blob = bucket.file(bnrId+"/"+i.originalname.replace(/ /g, "_"));
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
const Delete = async (bnrId) => {
  await bucket.deleteFiles({ prefix: `${bnrId}` });
};

module.exports = {Upload,Delete}