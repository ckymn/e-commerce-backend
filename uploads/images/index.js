const {Storage } = require("@google-cloud/storage");
const { format } = require("util");
const path = require("path")
const uuid = require("uuid")
const mimes = require("mime-types");
const { ERRORS:{FileApiErrors} } = require("../../utils/isFileExists");

const storage = new Storage({ 
	keyFilename: path.join(__dirname, "../../key.json"),
	projectId: "famous-hull-332022"
});
const bucketname = process.env.BUCKET_IMAGES;
const bucket = storage.bucket(bucketname);

const Upload = async (file, folder_path, file_name) => {
  try {
    // const file_path = path.resolve(folder_path, file_name);
    // if (!fs.existsSync(file_path)) {
    //   return FileApiErrors.FILE_NOT_EXISTS;
    // }

    let imgId = uuid.v4();
    const blob = bucket.file(imgId + "/" + file.originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      return { staus: 500, message: err.message };
    });
    let b = blobStream.on("finish", () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      return {
        publicUrl,
        imgId,
      };
    });
    blobStream.end(file.buffer);
    // await Clean_up({file_path})
    return b._events.finish();
  } catch (e) {
    console.log("BUCKET CREATION FAILED:", e)
  }
};

const Delete = async (imgId) => {
  try {
    await bucket.deleteFiles({ prefix: `${imgId}/`})
  } catch (e) {
    console.log("DELETE BUCKET FAILED",e)
  }
}

// const Clean_up = async ({file_path}) => {
//   return new Promise((resolve) => {
//       fs.unlink(file_path, () => {
//           resolve(true);
//       })
//   })
// }

module.exports = { Upload, Delete }