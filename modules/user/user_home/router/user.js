const Data = require("../../auth/model")

const route = async (req, res, next) => {
   try {
     let { kuserData } = req;

     let _admin = await Data.findOne({ _id: kuserData.id })
       .populate({
         path: "product_comment",
         select: "comment rate product_id",
         populate:{
           path: "product_id",
           select: "title"
         }
       })
       .populate({ 
         path: "follow", 
         select: "username storename storeimg" 
       });
     if(!_admin)
          return res.status(404).send({ status: false, message : "you are not admin stop!" });
     return res.status(200).send({ status: true, message: "token was created", data:  _admin })
   } catch (error) {
     if (error.code === 11000){
          return res.status(422).send({ status: false, message: `User Stores Page, Already Mongo Error` })
     }
     return res.status(422).send({ status: false, message: `We Don't Have Any Data`, data:null });
   }
}
module.exports = route