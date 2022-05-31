const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/auth/model");

const route = async (req, res, next) => {
  try {
    let { params, kuserData } = req;
    let current_time = new Date();

    let _data = await Data.findOne({ _id: params.id }).lean();
    if(!_data)
      return next(new ApiError("Store Not found",404,null));
      
    let start_store = _data.counter_weekly.getDate();
    
    if(Math.abs(current_time.getDate() - start_store) === 0){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.1": 1  },
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 1){
        await Store.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.2": 1 },
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 2){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.3": 1},
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 3){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.4": 1},
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 4){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.5": 1 },
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 5){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.6": 1},
          }
        );
    }
    if(Math.abs(current_time.getDate() - start_store) === 6){
        await Data.findOneAndUpdate(
          { _id: params.id },
          {
            $inc: { "wp_msg_count.7": 1 },
          }
        );
    }
    if (Math.abs(current_time.getDate() - start_store) === 7) {
      await Data.findOneAndUpdate(
        { _id: params.id },
        {
          $set: {
            "wp_msg_count.1": 0,
            "wp_msg_count.2": 0,
            "wp_msg_count.3": 0,
            "wp_msg_count.4": 0,
            "wp_msg_count.5": 0,
            "wp_msg_count.6": 0,
            "wp_msg_count.7": 0,
            "counter_weekly": new Date(+new Date()+7*24*3600*1000)
          },
        }
      );
    }
    
    res.send({ status: 200, message: "Whatsapp counter update" });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message));
  }
};
module.exports = route;
