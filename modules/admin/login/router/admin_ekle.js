const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { adminData , body } = req;
        let { email, username, password , permission } = body;

        let result = await Data.findOne({ $or: [ { email }, { username }] }).lean();
        if(!result)
            return next(new ApiError("email or username already exists",409));
        const hash = await bcrypt.hash(password, 10);
        if(adminData.role[0] === "admin"){
            let data = await new Data({
                ...body,
                role: "",
                password: hash,
                menu_permissions: permission.map(i => i)
            }).save();
            if(!data)
                return next(new ApiError("Create admin didn't work",400));
            return res.status(200).send({ status: true, message: "Admin Add Sub Admin Success ", data })
        }
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

module.exports = route;
