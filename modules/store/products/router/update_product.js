const Data = require("../model")

const route = async(req,res,next) => {
    try {
        let { body ,files ,params, userData } = req;

        let _data = await Data.findOne({ $and:[ { author: userData.id }, { _id: params.id } ] })
        if(!_data)
            return res.status(404).send({ status: false, message:"Not Found Update Data"})
        let data = await _data.set({
            ...body,
            variants: body.variants,
            futures: body.futures,
        })
        if(!data)
            return res.status(400).send({ status: false, message: "Update Data set doesn't work"})
        return res.status(200).send({ status: true, message: "Update Data Product Success", data})
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
            message: `Update Products Error Cannot Upload Something Missing => ${error}`,
          });
      }
    }
}

module.exports = route