const Data = require("../model")
const storage = require("../../../../uploads/images")

const route = async (req, res, next) => {
    try {
      let { file, userData } = req;
      if(!file){
          return res.status(400).send({ status: false, messsage: "Please Upload Image"})
      }
      let data = await Data.create({ author: userData.id });
      
      if (!data) {
        return res.status(400).send({ status: false, message: "Upload Images Error" });
      } else {
        const str = await storage.Upload(file, data._id);
        if (str.status !== 200)
          return res.status(str.status).send({ status: false, message: str.message });
        await Data.updateOne({ _id: data.id },{
          $set: {
            url: str.publicUrl,
          }
        });
        return res
          .status(200)
          .send({ status: true, message: "Upload Images Success", data });
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