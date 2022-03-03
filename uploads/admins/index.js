const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")

// creates a client 
const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});

const bucket = storage.bucket(String(process.env.BUCKET_ADMINS));

const Upload = async (file , adminId) => {
  try {
    const blob = bucket.file(adminId+"/"+file.originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      return { 
        staus: 400, 
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
      status: 400,
      message: `Could not upload the file: ${file.originalename}`,
    }
  };
};
const Delete = async (adminId) => {
  await bucket.deleteFiles({ prefix: `${adminId}` });
};

module.exports = {Upload,Delete}