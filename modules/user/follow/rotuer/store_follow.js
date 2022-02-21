const Data = require("../model")
const Store = require("../../../store/auth/model")
const User = require("../../auth/model")

const route = async(req,res,next) => {
    try {
        let { params, kuserData } = req;
        await Data.findOne({ $and: [{store_id: params.id},{author: kuserData.id}] }).lean().exec(async(err,data) => {
            if(!data){
                let _data = await new Data({
                    store_id: params.id,
                    author: kuserData.id
                });
                if(!_data)
                    return res.status(400).send({ status: false, message: "Follow Store Save Data Error"})
                await Store.findOneAndUpdate({ _id: params.id }, 
                    {
                        $push : {
                            "follow": kuserData.id
                        }
                    }, { new: true })
                    .lean().exec(async (err,data) => {
                        if(!data)
                            return res.status(400).send({ status: false, message: "Add follow store but update store follow filed failed"})
                        await User.findOneAndUpdate({ _id: kuserData.id },
                            {
                                $push: {
                                    "follow": data._id
                                }
                            })
                        await _data.save();
                    })
                return res.status(200).send({ status: true, message: "Add Follow Store and Update Store follow field success", data: _data})
            }
            return res.status(500).send({ status: false, message: "You Already Exist"})
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