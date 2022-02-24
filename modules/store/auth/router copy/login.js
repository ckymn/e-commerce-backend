require('dotenv').config();
const Data = require("../model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const route = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const _store = await Data.findOne({ $or: [{ username }, { email }] });
    
    let remain_date = _store.remain_date;
    if(!_store)
        return res.status(404).send({ status: false, message : "you have to signup" });
    let match = await bcrypt.compare(password, _store.password);
    if(!match)
        return res.status(401).send({ status: false, message: "password or email invalid" })
    let access_token = await jwt.sign({ 
      sub: _store.username, 
      id: _store.id,
      role: _store.role,
      storeimg: _store.storeimg
    }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
    return res.status(200).send({ status: true, message: "token was created", data : { access_token ,remain_date } })
  } catch (error) {
    if(error){
        if(error.name === "MongoError" && error.code === 11000)
            return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ status: false, message: `Store login  Error Cannot Upload Something Missing => ${error}`})
}
};
module.exports = route;
