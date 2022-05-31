const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { body } = req;
        let _data = await Data.find({}).lean();

        if(_data.length === 0){
            let data = await Data.create({
                words: body.words
            });
            return res.send({
              status: 200,
              message: "Create bad words success",
              data,
            });
        }else{
            let data = await Data.findOneAndUpdate({ _id: _data[0]._id },{
                $addToSet: {
                    words: body.words
                }
            });
            return res.send({
              status: 200,
              message: "Bad words update success",
              data,
            });
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,[]));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;