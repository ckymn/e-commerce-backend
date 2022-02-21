const Data = require("../../auth/model")

const route = async (req, res, next) => {
   try {
     let username = req.kuserData.sub;
     const _admin = await Data.findOne({ username });
     if(!_admin)
          return res.status(404).send({ status: false, message : "you are not admin stop!" });
     return res.status(200).send({ status: true, message: "token was created", data:  _admin })
   } catch (error) {
        return res.status(500).send({ status: false, message: `Admin Login ${error}`});
   }
}
module.exports = route