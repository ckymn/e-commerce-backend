const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")
const mime = require("mime-types")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket = storage.bucket(String(process.env.BUCKET_ADMIN_STORYS));

// image 
const Upload = async (file, storyId) => {
  const promises = [];
    file.forEach(i => {
        promises.push(
            new Promise((resolve, reject) => {
                const blob = bucket.file(storyId+"/"+i.originalname.replace(/ /g, "_"));
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
};

// delete
const Delete = async (storyIds) => {
  await bucket.deleteFiles({ prefix: `${storyIds}` });
}
// video
const vUpload = async (file,storyId) => {
  try {
    let type = mime.lookup(file[0].originalname);
    
    const blob = bucket.file(`${storyId}/vide.${mime.extensions[type][0]}`);
    const blobStream = blob.createWriteStream({
      resumable: true,
		  contentType: type,
		  predefinedAcl: 'publicRead',
    });

    blobStream.on("error", (err) => {
      next(err);
    });
    let b = blobStream.on('finish', () => {
      res.status(200).json({
        data: {
          url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        },
      });
    })
    console.log('url',await b._events.finish())
    blobStream.end(file[0].buffer);
  } catch (error) {
    return {
      status: 500,
      message: `Could not upload the file: ${file[0].originalname}`,
    }
  };
}



module.exports = {Upload,vUpload,Delete}