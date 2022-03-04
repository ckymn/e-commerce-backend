const Data = require("../model");
const storage = require("../../../../uploads/images")

const route = async (req, res, next) => {
  try {
    let { userData, body } = req;
    let { arr } = body;

    if (Array.isArray(arr) && arr.length > 0) {
      arr.map(async (i) => {
        await Data.deleteOne({ $and: [{ author: userData.id }, { _id: i }] });
        await storage.Delete(i).catch(console.error);
      });
      return res.status(200).send({ status: false, message: "Delete Images Success"})
    }
    return res.status(400).send({ status: false, message: "Firstly Upload Image For Delete"})
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(422)
        .send({ status: false, message: `File Already exists: ${error}` });
    } else {
      return res.status(500).send({
        status: false,
        message: `Store Add Images ,Something Missing => ${error}`,
      });
    }
  }
}

module.exports = route;