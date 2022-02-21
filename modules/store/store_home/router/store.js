const Data = require("../../auth/model")

const route = async (req, res, next) => {
   try {
     let username = req.userData.sub;
     await Data.findOne({ username })
          .populate({ path: 'comment' , select: 'comment rate' })
          .populate({ path: 'follow' , select: 'username' })
          .lean()
          .exec((err,data) => {
               if(!data)
                    return res.status(404).send({ status: false, message : "Not Found on Store" });
               return res.status(200).send({ status: true, message: "token was created", data })
          })
     } catch (error) {
     if(error){
         if(error.name === "MongoError" && error.code === 11000)
             return res.status(error.code).send({ status: false, message: `Find Store, MongoError Database Already Exist : ${error}` })
     }
     return res.status(500).send({ status: false, message: `Find Store, Missing Error : ${error}` })
 }
}
module.exports = route