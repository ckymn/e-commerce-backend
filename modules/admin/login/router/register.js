const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/admins")
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { file , body } = req;
        let { email, username, password  } = body;

        if(!file)
            return next(new ApiError("Please upload a file",400))
        let _data = await Data.findOne({ $and: [ { email }, { username }] });
        if(_data)
            return res.status(500).send({ status: false, message: "email or username already exists"})
        let hash = await bcrypt.hash(password, 10);
        const _user = await new Data({
            ...req.body,
            password:hash,
        }).save();
        const str = await storage.Upload(file,_user._id);
        if(str.status !== 200)
            return next(new ApiError(str.message,400));
        await Data.updateOne({_id: _user._id},{
            img: str.publicUrl
        })
        return res.status(200).send({ status: true, message: "admin register success"})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route