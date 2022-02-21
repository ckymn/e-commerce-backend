const { Store_Comment } = require("../model")
const Store = require("../../../store/auth/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params } = req;
        let _data = await new Store_Comment({
            ...body,
            store_id: params.id,
            author: kuserData.id,
        })
        if(!_data)
            return res.status(400).send({ status: false, message: "Add Store Comment Data Error"})
        let p_data = await Store.findOneAndUpdate({ _id: params.id }, 
            {
                $push: {
                    "comment": _data._id
                }
            }, { new: true })
        if(!p_data)
            return res.status(400).send({ status: false, message: "Add Store Comment Data success but Update Store Comment error"})
        await _data.save();
        return res.status(200).send({ status: true, message: "User add Store Comment Success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User add Store Comment, Something Missing Error : ${error}`})
    }
}

module.exports = route