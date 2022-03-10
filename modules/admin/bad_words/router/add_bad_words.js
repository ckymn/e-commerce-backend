const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { body } = req;

        let data = await Data.find({}).lean();

        if(!data){
            let data = await Data.create({
                words: body.words
            });
            return res.status(200).send({ status: true, message: "Create bad words success" ,data });
        }
        let word = await Data.findOneAndUpdate({ _id: data[0]._id },{
            $addToSet: {
                words: body.words
            }
        });
        if(!word)
        return next(new ApiError("Bad words update dont match", 404, word));
        return res.status(200).send({ status: true, message: "Bad words update success",word})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route;