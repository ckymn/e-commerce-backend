const Data = require('../../../store/auth/model')

const route = async (req, res) => {
  try { 
    let { id } = req.params;
    await Data.findOne({ $and: [ { _id: id } , { is_approved: { $in: "yes" }} ] }).lean().exec(async(err,data) => {
        if(err)
            return res.status(404).send({ status: false, message: "Not Found any Data Store for Suspend"})
        if(is_approved === "wait"){
            await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true }).lean().exec((err,data) => {
                if(err)
                    return res.status(400).send({ status: false, message: "get Suspend Store store don't cahange to WAIT"})
                return res.status(200).send({ status: true, message: "get Suspend Store store change success WAIT"})
            })
        }
    })
  } catch (error) {
    if(error){
      if(error.name === "MongoError" && error.code === 11000)
          return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ 
      status: false,
      message: `Single Post Advertisement Notificaton Error Cannot Upload Something Missing => ${error}`
    })
  }
  
};

module.exports = route;