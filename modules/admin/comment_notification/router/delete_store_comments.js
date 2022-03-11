const { Store_Comment } = require("../../../user/comment/model")
const Store = require("../../../store/auth/model")
const User = require("../../../user/auth/model")


const route = async (req,res,next) => {
    try {
        let { params } = req;
        await Store_Comment.findOne({ _id: params.id }).lean().exec(async(err,data) =>{
            if(!data)
                return next(new ApiError("Store find comment not found",404));  
            await Product_Comment.findOneAndDelete({ _id: params.id }).lean().exec(async(err,data) => {
                if(!data)
                return next(new ApiError("Update store comment didn't match",409));
                await Store.updateOne({ _id: data.store_id },
                    {
                        $pull: {
                            comment: {
                                $in: data._id
                            }
                        }
                    }
                ).lean().exec(async(err,data) =>{
                    console.log(data)
                    if(err)
                        return res.status(400).send({ status: false, message: "Delete Comment of Store by Admin Failed"})
                })
                await User.updateOne({ _id: data.author },
                    {
                        $pull: {
                            store_comment: {
                                $in: data._id
                            }
                        }
                    }
                ).lean().exec(async(err,data) =>{
                    if(data.matchedCount === 0)
                        return next(new ApiError("Update store comment on User didn't match",409));
                })
            })
            return res.send({ status: 200, message: "Store Comments Changing by Admin success " })
        })
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

module.exports = route  