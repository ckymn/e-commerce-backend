const Data = require("../model")
const Store = require("../../../store/auth/model")
const User = require("../../auth/model")

const route = async(req,res,next) => {
    try {
        let { params, kuserData } = req;
        await Data.findOneAndRemove({ $and: [{ author: kuserData.id },{ store_id: params.id }] })
            .lean().exec(async (err,data) => {
                if(!data) 
                    return res.status(400).send({ status: false, message: "Remove Follower in Data failed"})
                await Store.updateOne({ _id: params.id },
                    {
                        $pull: {
                            follow: {
                                $in: kuserData.id
                            }
                        }
                    }).lean().exec(async(_err,_data) => {

                        if(data.matchedCount === 0)
                            return res.status(400).send({ status: false, message: "Remove Follower in Data succes but Delete follow filed in Store Data failed"})
                        await User.updateOne({ _id: kuserData.id },
                            {
                                $pull: {
                                    follow: {
                                        $in: params.id
                                    }
                                }
                            }).exec((err,data) => {
                                if(data.matchedCount === 0)
                                    return res.status(400).send({ status: false, message: "Remove Follower in Data succes but Delete follow in User Error"})
                            })
                        })
                return res.status(200).send({ status: true, message: "Remove Follower in Data and Delete Follow _id filed in Data success"})
            })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Follow Store , Something Missing Error : ${error}`})
    }
};

module.exports = route;