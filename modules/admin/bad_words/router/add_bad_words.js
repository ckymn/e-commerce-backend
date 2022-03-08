const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { body } = req;
        let data = await Data.find({}).lean();
        if(data.length === 0){
            let data = new Data({
                words: body.words
            }).save();
            if(!data)
                return next(new ApiError("Bad words dont work", 400)); 
            return res.status(200).send({ status: true, message: "Create bad words success" });
        }
        let u_words = await Data.updateOne({ _id: data[0]._id },{
            $addToSet: {
                words: body.words
            }
        });
        if(!u_words)
            return next(new ApiError("Bad words update dont match", 409));
        return res.status(200).send({ status: true, message: "Bad words update success"})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route;