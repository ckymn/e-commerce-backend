require("dotenv").config();
const jwt = require("jsonwebtoken");

const route = async (req, res, next) => {
  try {
    let { userData } = req;
    let access_token = await jwt.sign(
      { id: userData.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: 1 }
    );
    console.log(access_token);
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
