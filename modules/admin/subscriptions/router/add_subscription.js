const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body, files, adminData } = req;
        let data = await new Data({
            ...body 
        }).save()
        if(!data)
            return res.status(400).send({ status: false, message: `Not Found Subscribe Data`})
        const imagesUrl = await storage.Upload(files,data._id);
        let str = await Promise.all(imagesUrl).then(d => d );
        let u_sbs = await Data.updateOne({_id: data._id},{
            $push: {
                img: str,
            },
        })
        if(u_sbs.matchedCount === 0)
            return next(new ApiError("Subscribe dont match",409))
        return res
          .status(200)
          .send({ status: true, message: "Subscribe Data success", data });
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