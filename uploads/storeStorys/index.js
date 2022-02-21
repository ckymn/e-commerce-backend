const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket = storage.bucket(String(process.env.BUCKET_STORE_STORYS));

// image
const upload = async (file , username, storyId) => {
  try {

    if(!file)
      return { status: 400, message: "Please upload a file!" }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(username+"/"+storyId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +file.originalname.replace(/:/g, "-"));
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

//video
const vUpload = async (file,username,storyId) => {
  try {
    let type = mime.lookup(file.originalname);
    console.log("type: ",type);
    console.log("add :", mime.extensions[type][0])
    console.log("file.originalname: ", file.originalename)
    if(!file)
      return { status: 400, message: "Please upload a file!" }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(username+"/"+storyId+"/"+new Date().toISOString().replace(/:/g,"_") +"-" +file.originalname.replace(/:/g, "-"));
    const blobStream = blob.createWriteStream({
      resumable: true,
		  contentType: type,
		  predefinedAcl: 'publicRead',
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
}
const Delete = async (username, storyIds) => {
    return await storyIds.map( async i =>{
        
        return await bucket.deleteFiles({ prefix: `${username}/${i}`}, (err,file) => {
            if(err){
              return {
                status: 500,
                message: "Admin Storys Delete Error in Google Cloud Storage"
              }
            }
        })

    })
}

const SingleDelete = async (username, storyIds) => {
  return  await bucket.deleteFiles({ prefix: `${username}/${storyIds}/`}, (err,files) => {
       if(err)
           return {
             status: 500,
             message: "Admin Storys Single Delete Error in Google Cloud Storage"
           }
   });
}

module.exports = {upload,vUpload,Delete,SingleDelete}