require("dotenv").config();
const AdminRegister = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const route = async (req, res, next) => {
   try {
        const { email , username, password } = req.body;
        const _admin = await AdminRegister.findOne({ $or: [ {email}, {username} ]});
        if(!_admin)
            return res.status(404).send({ status: false, message : "you are not admin stop!" });
        let match = await bcrypt.compare(password, _admin.password)
        if(!match)
            return res.status(401).send({ status: false, message: "password or email invalid"});
        let access_token = await jwt.sign({ sub: _admin.username, id: _admin.id , role: _admin.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
        return res.status(200).send({ status: true, message: "token was created", data:  access_token })
   } catch (error) {
        return res.status(500).send({ status: false, message: `Admin Login ${error}`});
   }
}
module.exports = route