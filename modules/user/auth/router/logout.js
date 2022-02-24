require("dotenv").config();
const jwt = require("jsonwebtoken");

const route = async (req, res, next) => {
  try {
    let { kuserData } = req;
    await jwt.sign({ id: kuserData.id }, process.env.JWT_ACCESS_SECRET,{ expiresIn: "1ms" });
    return res.status(200).send({ status: true, message:"logout was successed"})
  } catch (error) {
    if(error){
        if(error.name === "MongoError" && error.code === 11000)
            return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ status: false, message: `Store Logout Error Cannot Upload Something Missing => ${error}`})
}
};

module.exports = route;
