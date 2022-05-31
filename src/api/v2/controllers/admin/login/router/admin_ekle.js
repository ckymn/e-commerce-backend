const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { adminData , body } = req;
        let { email, username, password , permission } = body;

        let result = await Data.findOne({ $or: [ { email }, { username }] }).lean();
        if(!result)
            return next(new ApiError("email or username already exists",404,[]));
        const hash = await bcrypt.hash(password, 10);
        if(adminData){
            if(adminData.role[0] === "admin"){
                let data = await Data.create({
                    ...body,
                    role: "",
                    password: hash,
                    menu_permissions: permission.map(i => i)
                })
                return res.send({ status: 200, message: "Admin Add Sub Admin Success ", data })
            }else{
                return next(new ApiError("you are not admin",400, []))
            }
        }else{
            return next(new ApiError("Admin not found", 404, []))
        }
        
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;
