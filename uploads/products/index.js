const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket_name = String(process.env.BUCKET_IMAGES)
const bucket = storage.bucket(bucket_name);

const MultiUpload = (files , userId , imgId) => {
    const promises = [];
    files.forEach(i => {
        promises.push(
            new Promise((resolve, reject) => {
                const blob = bucket.file(userId+"/"+imgId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +i.originalname.replace(/:/g, "-"));
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
const Upload = (file, userId , imgId) => {
    try {

        if(!file)
          return { status: 400, message: "Please upload a file!" }
        const blob = bucket.file(userId+"/"+imgId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +file.originalname.replace(/:/g, "-"));
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
    
        blobStream.on("error", (err) => {
          return { 
            staus: 500, 
            message: err.message 
          }
        });
        let b =  blobStream.on("finish", async () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          return {
            status: 200,
            message: "Uploaded the file successfully: " + file.originalname,
            publicUrl
          }
        });
        blobStream.end(file.buffer);
        return  b._events.finish()
      } catch (error) {
        return {
          status: 500,
          message: `Could not upload the file: ${file.originalename}`,
        }
      };
};

const Delete = async (userId, imgId) => {
   return  await bucket.deleteFiles({ prefix: `${userId}/${imgId}/`}, (err,files) => {
        if(err)
            return err
    });
}

const SingleDelete = async (userId, files) => {
    let a = files.map(v => v.substr((48+userId.length)))
    return await a.map( async i =>{
        
        return await bucket.deleteFiles({ prefix: `${userId}/${i}`}, (err,file) => {
            if(err)
                return err
        })

    })
}

module.exports = { Upload, Delete , SingleDelete, MultiUpload }