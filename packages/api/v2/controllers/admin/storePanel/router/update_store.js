const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/auth/model");

const route = async (req, res, next) => {
  try {
    let { params } = req;
    let { extra_remain_date , suspension_status } = req.body;

    if (extra_remain_date){
      let data = await Data.updateOne({ _id: params.id },{
        $inc: {
          "remain_date.time": extra_remain_date,
        },
      });
      if(data.matchedCount === 0){
        return next(new ApiError("Admin update store dont match",409,[]));
      }else{
        return res.send({status: 200, message: "Update Store Remain Date Success",data:[]});
      }
    }
    if(suspension_status){
      if(suspension_status === "yes"){
        await Data.findOneAndUpdate({ _id: params.id },{ $set:{ is_approved:"yes" }})
          .lean().exec(async(err,data) => {
            if(!data){
              return res.send({ status: 404, message: "Store wait-no to yes don't work",data});
            }else{
              return res.send({ status: 200, message: "Store wait-no to yes successed",data});
            }
          });
      }else{
        await Data.findOneAndUpdate({_id: params.id },{ $set:{ is_approved:"wait" }})
          .lean().exec(async(err,data) => {
            if(!data){
              return res.send({ status: 404, message: "Store yes-no to wait don't work",data});
            }else{
              return res.send({ status: 200, message: "Store yes-no to wait successed",data});
            }
          });
      }   
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