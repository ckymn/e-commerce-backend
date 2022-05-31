const ApiError = require('../../../../errors/ApiError');
const Data = require('../../../store/products/model')

const route = async (req, res, next) => {
  try { 
    let { params } = req;
    let { is_approved } = req.body;

    await Data.findOne({ $and:[{_id: params.id },{is_approved:"wait"}]}).select("is_approved").lean().exec(async(err,data) => {
      if(!data)
        return next(new ApiError("Product permissions not found",404,[]));

        if(is_approved === "no"){
          let data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }}, { new: true })
          if(!data) 
            return next(new ApiError("Product permissions didnt match",404,[]));
          return res.send({ status: 200, message: "get single notification change success NO",data})
        }
        if(is_approved === "yes"){
          let data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "yes" }}, { new: true })
          if(!data) 
            return next(new ApiError("Product permissions didnt match",404,[]));
          return res.send({ status: 200, message: "get single notification change success YES",data})
      }
    })
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