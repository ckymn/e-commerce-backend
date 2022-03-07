const Data = require("../model")
const Store = require("../../../store/auth/model")
const User = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async(req,res,next) => {
    try {
        let { params, kuserData } = req;
        await Data.findOneAndRemove({ $and: [{ author: kuserData.id },{ store_id: params.id }] })
            .lean().exec(async (err,data) => {
                if(!data) 
                    return next(new ApiError("Store unfollow Not found!",404));
                await Store.updateOne({ _id: params.id },
                    {
                        $pull: {
                            follow: {
                                $in: kuserData.id
                            }
                        }
                    }).lean().exec(async(_err,_data) => {
                        if(data.matchedCount === 0)
                            return next(new ApiError("Store unfollow update in Store didn't match",404));
                        await User.updateOne({ _id: kuserData.id },
                            {
                                $pull: {
                                    follow: {
                                        $in: params.id
                                    }
                                }
                            }).exec((err,data) => {
                                if(data.matchedCount === 0)
                                    return next(new ApiError("Store unfollow update in user didn't match",404))
                            })
                    })
                return res.status(200).send({ status: true, message: "Remove Follower in Data and Delete Follow _id filed in Data success"})
            })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;