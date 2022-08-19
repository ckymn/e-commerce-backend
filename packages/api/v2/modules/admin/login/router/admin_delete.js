const Data = require("../model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
  try {
    let { adminData , params } = req;   

    if(adminData){
      if(adminData){
        if(adminData.role[0] === "admin"){
          await Data.findOneAndDelete({ _id: params.id  }).lean().exec((err,data) => {
            if(!data)
              return next(new ApiError("Delete admin didn't match",404,[]));
            return res.send({ status: 200, message: "Sub Admin Delete by Admin is success",data});
          });
        }}
      else{
        return next(new ApiError("You are not admin ",400,[]));
      }
    }else{
      return next(new ApiError("Admin not found", 404, []));
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
