const Data = require("../../login/model")

const route = async (req, res, next) => {
   try {
     let username = req.adminData.sub;
     await Data.findOne({ username }).lean().exec((err,data) => {
          if(err)
               return res.status(404).send({ status: false, message : "you are not admin stop!" });
          return res.status(200).send({ status: true, message: "token was created", data:  data })
     });
   } catch (error) {
        return res.status(500).send({ status: false, message: `Admin Login ${error}`});
   }
}
module.exports = route