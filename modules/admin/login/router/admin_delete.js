const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { adminData , params } = req;   

        if(adminData.role[0] === "admin"){
           await Data.deleteOne({ _id: params.id  }).lean().exec((err,data) => {
               console.log(data);
                if(data.deletedCount === 0)
                    return next(new ApiError("Delete admin didn't match",409));
                return res.status(200).send({ status: true, message: "Sub Admin Delete by Admin is success "})
           })
        }else{
            return next(new ApiError("You are not admin", 400));
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
