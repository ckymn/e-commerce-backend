const Data = require("../model")
const bcrypt = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { adminData , params , body } = req;
        let { password , menu_permissions } = body;

        let hash = await bcrypt.hash(password, 10);
        if(adminData){
            if(adminData.role[0] === "admin"){
            await Data.updateOne({  _id: params.id },
                {
                    $set: {
                        ...body,
                        password: hash,
                        menu_permissions: menu_permissions.map(i => i)
                    }
                }).lean().exec((err,data) => {
                        if(data.matchedCount === 0)
                            return next(new ApiError(`Sub Admin Update by Admin failed`,400,data));
                        return res.send({ status: 200, message: "Sub Admin Update by Admin is success ",data})
                })
            }else{
                return next(new ApiError("You are not admin ",400,null));
            }
        }else{  
            return next(new ApiError("Admin not found", 404, null))
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route;
