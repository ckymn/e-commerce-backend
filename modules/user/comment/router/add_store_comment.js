const { Store_Comment } = require("../model")
const Store = require("../../../store/auth/model")
const User = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")
const BadWords = require("../../../admin/bad_words/model")
const Filter = require("bad-words")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params } = req;

        // comment
        let filter = new Filter();
        let data = await BadWords.find({}).select("words -_id").lean();
        let words = data[0].words;
        await filter.addWords(...words);
        let _comment = filter.clean(body.comment).split("").filter(i => {
            if(i === "*")
                return true
            return false
        })
        if(_comment.length > 0)
            return next(new ApiError(" Your comment not available",200,[]))
        
        //store comment
        let _data = await Store_Comment.create({
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
            return res.status(400).send({ status: false, message: "Add Store Comment Data to Store success but Update Store Comment error"})
        let u_data = await User.findOneAndUpdate({ _id: kuserData.id }, 
            {
                $push: {
                    "store_comment": _data._id
                }
            }, { new: true })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Add Store Comment Data to User success but Update Store Comment error"})
        await _data.save();
        return res.send({ status: 200, message: "User add Store Comment Success", data: _data })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route