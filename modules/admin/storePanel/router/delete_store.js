const Data = require('../../../store/auth/model')
const { sendEmail } = require("../../../../utils")

const route = async (req, res) => {
  try { 
    let { id } = req.params;
    await Data.findOneAndRemove({ _id: id }).lean().exec(async(err,data) => {
        if(err)
            return res.status(404).send({ status: false, message: "Not Found any Data Store for Delete"})
        let _email = await sendEmail(data.email, " VitrinInt ", " Your Store Was Delete by Admin  ")
        if(!_email)
            return res.status(535).send({ status: false, message: "get Delete Store success but didn't send email to own store "})
        return res.status(200).send({ status: true, message: "get Delete Store change success "})
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