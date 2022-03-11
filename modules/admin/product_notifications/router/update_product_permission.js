const ApiError = require('../../../../errors/ApiError');
const Data = require('../../../store/products/model')

const route = async (req, res, next) => {
  try { 
    let { params } = req;
    let { is_approved } = req.body;

    await Data.findOne({ $and:[{_id: params.id },{is_approved:"wait"}]}).select("is_approved").lean().exec(async(err,data) => {
      if(!data)
        return next(new ApiError("Product permissions not found",404));
        if(is_approved === "no"){
          let data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }}, { new: true })
          if(!data) 
            return next(new ApiError("Product permissions didnt match",409));
          return res.send({ status: 200, message: "get single notification change success NO",data})
        }
        if(is_approved === "yes"){
          let data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "yes" }}, { new: true })
          if(!data) 
            return next(new ApiError("Product permissions didnt match",409));
          return res.send({ status: 200, message: "get single notification change success YES",data})
      }
      // if(data.is_approved === "no"){
      //   if(is_approved === "wait"){
      //     let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "wait" }}, { new: true })
      //     if(!n_data) 
      //       return next(new ApiError("Product permissions didnt match",409));
      //     return res.send({ status: 200, message: "get single notification change success WAIT"})
      //   }
      //   if(is_approved === "yes"){
      //     let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "yes" }}, { new: true })
      //     if(!n_data) 
      //       return next(new ApiError("Product permissions didnt match",409));
      //     return res.send({ status: 200, message: "get single notification change success YES"})
      //   }
      // }
      // if(data.is_approved === "yes"){
      //   if(is_approved === "no"){
      //     let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }}, { new: true })
      //     if(!n_data) 
      //       return next(new ApiError("Product permissions didnt match",409));
      //     return res.send({ status: 200, message: "get single notification change success NO"})
      //   }
      //   if(is_approved === "wait"){
      //     let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "wait" }}, { new: true })
      //     if(!n_data) 
      //       return next(new ApiError("Product permissions didnt match",409));
      //     return res.send({ status: 200, message: "get single notification change success WAIT"})
      //   }
      // }
    })
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