const Data = require("../model");

const route = async (req, res, next) => {
  try {
    await Data.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res
            .status(400)
            .send({ status: false, message: "Don't Find How I Use Page" });
        } else {
          return res
            .status(200)
            .send({ status: true, message: "Find How I Use Page Success" });
        }
      });
  } catch (error) {
    if (error) {
      if (error.name === "MongoError" && error.code === 11000)
        return res.status(error.code).send({
          status: false,
          message: `Find Store, MongoError Database Already Exist : ${error}`,
        });
    }
    return res.status(500).send({
      status: false,
      message: `Find Store, Missing Error : ${error}`,
    });
  }
};
module.exports = route;
