const ApiError = require('../../../../errors/ApiError');
const Data = require('../../../store/auth/model')

const route = async (req, res) => {
  try { 
    let { id } = req.params;
    let { is_approved } = req.body;

    await Data.findOne({ _id: id }).lean().exec(async(err,data) => {
      if(!data)
        return next(new ApiError("Store update not found", 404));
      if(data.is_approved === "wait"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get update notification store don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get update notification store change success NO"})
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id },{ $set: { is_approved: "yes" } }, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get update notification store don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get update notification store change success YES"})
        }
      }
      if(data.is_approved === "no"){
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get update notification store don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get update notification store change success WAIT"})
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "yes"} }, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "yes"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get update notification store don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get update notification store change success NO"})
        }
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get update notification store don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get update notification store change success WAIT"})
        }
      }
    })
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