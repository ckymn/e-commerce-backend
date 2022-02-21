const Data = require('../../../store/products/model')

const route = async (req, res) => {
  try { 
    let { id } = req.params;
    let { is_approved } = req.body;
    await Data.findOne({ _id: id }).select("is_approved").lean().exec(async(err,data) => {
      if(err)
        return res.status(404).send({ status: false, message: "Not Found any Data"})
      if(data.is_approved === "wait"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get single notification change success NO"})
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "yes" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "no"){
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
        if(is_approved === "yes"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "yes" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "yes"){
        if(is_approved === "no"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get single notification change success NO"})
        }
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
      }
    })
  } catch (error) {
    if(error){
      if(error.name === "MongoError" && error.code === 11000)
          return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ 
      status: false,
      message: `Single Post Product Notificaton Error Cannot Upload Something Missing => ${error}`
    })
  }
  
};

module.exports = route;