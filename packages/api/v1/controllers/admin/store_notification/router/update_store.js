const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/auth/model");

const route = async (req, res) => {
  try { 
    let { id } = req.params;
    let { is_approved } = req.body;

    await Data.findOne({ _id: id }).lean().exec(async(err,data) => {
      if(!data)
        return next(new ApiError("Store update not found", 404,data));

      if(data.is_approved === "wait"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get update notification store don't cahange to NO",data:[]});
          return res.send({ status: 200, message: "get update notification store change success NO", data});
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id },{ $set: { is_approved: "yes" } }, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get update notification store don't cahange to YES",data:[]});
          return res.send({ status: 200, message: "get update notification store change success YES",data});
        }
      }
      if(data.is_approved === "no"){
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get update notification store don't cahange to WAIT",data:[]});
          return res.send({ status: 200, message: "get update notification store change success WAIT",data});
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "yes"} }, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get single notification don't cahange to YES",data:[]});
          return res.send({ status: 200, message: "get single notification change success YES",data});
        }
      }
      if(data.is_approved === "yes"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get update notification store don't cahange to NO", data:[]});
          return res.send({ status: 200, message: "get update notification store change success NO",data});
        }
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true });
          if(!n_data) 
            return res.send({ status: 404, message: "get update notification store don't cahange to WAIT",data:[]});
          return res.send({ status: 200, message: "get update notification store change success WAIT",data});
        }
      }
    });
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