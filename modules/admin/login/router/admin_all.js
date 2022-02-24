const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { adminData, params } = req;
        await Data.find({})
          .lean()
          .exec((err, data) => {
            if (err) {
              return res
                .status(400)
                .send({ status: false, message: "All Sub Admin failed" });
            } else {
              return res
                .status(200)
                .send({
                  status: true,
                  message: "All Sub Admin  success ",
                  data,
                });
            }
          });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Add Sub Admin Error, Missing Somethimes => ${error}`})
    }
};

module.exports = route;
