require("dotenv").config();
const jwt = require("jsonwebtoken");

const route = async (req, res, next) => {
  try {
    let { kuserData } = req;
    let _token = await jwt.sign({ _id: kuserData.id },process.env.JWT_ACCESS_SECRET,{ expiresIn:1 });
    if (_token) 
      return res.status(200).send({ status: true, message : 'You have been Logged Out' });
    return res.status(400).send({ status: false, message:'Logout Error'});
  } catch (error) {
    if(error){
        if(error.name === "MongoError" && error.code === 11000)
            return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ status: false, message: `Store Logout Error Cannot Upload Something Missing => ${error}`})
  }
};

module.exports = route;
