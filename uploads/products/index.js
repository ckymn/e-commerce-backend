const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket_name = String(process.env.BUCKET_PRODUCTS)
const bucket = storage.bucket(bucket_name);

const Upload = (files , username , productId) => {
    const promises = [];
    files.forEach(i => {
        promises.push(
            new Promise((resolve, reject) => {
                const blob = bucket.file(username+"/"+productId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +i.originalname.replace(/:/g, "-"));
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

const Delete = async (username, productId) => {
   return  await bucket.deleteFiles({ prefix: `${username}/${productId}/`}, (err,files) => {
        if(err)
            return err
    });
}

const SingleDelete = async (username, files) => {
    let a = files.map(v => v.substr((48+username.length)))
    return await a.map( async i =>{
        
        return await bucket.deleteFiles({ prefix: `${username}/${i}`}, (err,file) => {
            if(err)
                return err
        })

    })
}

module.exports = { Upload, Delete , SingleDelete }