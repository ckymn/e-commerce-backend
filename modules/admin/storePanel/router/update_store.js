const Data = require("../../../store/auth/model")

const route = async (req, res, next) => {
    try {
        let { params } = req;
        let { extra_remain_date , suspension_status } = req.body;

        if (extra_remain_date){
          let _data = await Data.updateOne({ _id: params.id },{
                $inc: {
                    "remain_date.time": extra_remain_date,
                },
            });
            if(_data.matchedCount === 0){
                return res.status(404).send({ status: false, message: "Admin Update Store  "})
            }else{
                return res.status(200).send({status: true, message: "Update Store Remain Date Success"})
            }
        }
        if(suspension_status){
            if(suspension_status === "yes"){
                await Data.findOneAndUpdate({ _id: params.id },{ $set:{ is_approved:"yes" }})
                .lean().exec(async(err,data) => {
                    if(!data){
                        return res.status(404).send({ status: false, message: "Store wait-no to yes don't work"})
                    }else{
                        return res.status(200).send({ status: true, message: "Store wait-no to yes successed"})
                    }
                })
            }else{
                await Data.findOneAndUpdate({_id: params.id },{ $set:{ is_approved:"wait" }})
                .lean().exec(async(err,data) => {
                    if(!data){
                        return res.status(404).send({ status: false, message: "Store yes-no to wait don't work"})
                    }else{
                        return res.status(200).send({ status: true, message: "Store yes-no to wait successed"})
                    }
                })
            }   
        }
    } catch (error) {
      console.log(error);
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: `File Already exists!  : ${error}` });
      } else {
        return res
          .status(500)
          .send({
            status: false,
            message: `Admin/Update Store, Something Missing => ${error}`,
          });
      }
    }
}

module.exports = route