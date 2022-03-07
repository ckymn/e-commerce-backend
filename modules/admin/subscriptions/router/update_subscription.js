const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")
const ApiError = require("../../../../errors/ApiError")


const route = async (req, res, next) => {
    try {
        let { files , params, body } = req;

        let data = await Data.findOne({ _id: params.id })
        if(!data)
            return res.status(400).send({ satus: false, message: "Not Found Update Subscribe"})
        await storage.Delete(data._id)
        let str = await storage.Upload(files,data._id);
        let u_data =  await Data.updateOne({_id: data._id},{
            $push: {
                img: str,
            },
        }).save();
        if(!u_data)
            return res.status(400).send({ status: false, message: "Update Data set doesn't work"})
        return res.status(200).send({ status: true, message: "Update Subscribe success", data})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route