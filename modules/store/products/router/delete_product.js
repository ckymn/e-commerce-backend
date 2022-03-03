const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;

        let s_d = await Data.deleteOne({ $and: [ {author: userData.id}, { _id: params.id } ] }).lean();
        if(s_d.deletedCount === 0)
            return res.status(404).send({ status: false, message: "Single product delete error"})
        return res.status(200).send({ status: true, message: "Single product delete success" })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(500)
          .send({ status: false, message: `File Already exists!  : ${error}` });
      } else {
        return res
          .status(500)
          .send({
            status: false,
            message: `Delete Product Error Cannot Upload Something Missing => ${error}`,
          });
      }
    }
}

module.exports = route