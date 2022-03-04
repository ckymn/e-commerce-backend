const Data = require("../model")
const storage = require("../../../../uploads/images")
const { v4: uuidv4 } = require("uuid")

const route = async (req, res, next) => {
    try {
      let { file, files, userData } = req;
      if(file){
        let data = await Data.create({ author: userData.id });
        const str = await storage.Upload(file, data._id);
        if (str.status !== 200)
          return res.status(str.status).send({ status: false, message: str.message });
        await Data.updateOne({ _id: data.id },
          {
            $set: {
              url: str.publicUrl,
            },
          }
        );
        return res
          .status(200)
          .send({ status: true, message: "Upload Images Success", data });
      
      }
      if (files) {
        console.log('files')
        files.map(async (i) => {
          let data = await Data.create({ author: userData.id });
          const str = await storage.Upload(i, data._id);
          await Data.updateOne({ _id: data._id },
            {
              $set: {
                url: str.publicUrl,
              },
            }
          );
        });
        return res
          .status(200)
          .send({ status: true, message: "Upload Images Success"});
      }
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: `File Already exists!  : ${error}` });
      } else {
        return res
          .status(422)
          .send({
            status: false,
            message: `Upload Images , Something Missing => ${error}`,
          });
      }
    }
}

module.exports = route;