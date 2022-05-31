const Data = require("../model")
const Store = require("../../../store/auth/model")
const User = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async(req,res,next) => {
    try {
        let { params, kuserData } = req;
        await Data.findOne({ $and: [{store_id: params.id},{author: kuserData.id}] })
            .lean().exec(async(err,data) => {
                if(!data){
                    let _data = await Data.create({
                        store_id: params.id,
                        author: kuserData.id
                    });
                    await Store.findOneAndUpdate({ _id: params.id }, 
                        {
                            $push : {
                                "follow": kuserData.id
                            }
                        }, { new: true })
                        .lean().exec(async (err,data) => {
                            if(!data)
                                return next(new ApiError("User store follow Not Found",404,null))
                            let u_follow = await User.findOneAndUpdate({ _id: kuserData.id },
                              {
                                $push: {
                                  follow: data._id,
                                },
                              }
                            );
                            if(!u_follow)
                                return next(new ApiError("User store follow in user database Not found",404,null))
                        })
                    return res.send({ status: 200, message: "Store Follow Success", data: _data})
                }else{
                    return next(new ApiError("Store follow already exist", 400,null));
                }
            })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;