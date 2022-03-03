const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket = storage.bucket(String(process.env.BUCKET_STORES));

const Upload = async (file , username) => {
  try {

    if(!file)
      return { status: 400, message: "Please upload a file!" }
    const blob = bucket.file(username+"/"+file.originalname.replace(/ /g, "_"));
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
  //delete
const Delete = async (adsId) => {
  await bucket.deleteFiles({ prefix: `${adsId}` });
};
module.exports = {Upload,Delete}