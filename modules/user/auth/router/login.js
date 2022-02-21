require("dotenv").config();
const Data = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const route = async (req, res, next) => {
   try {
        const { email , username, password } = req.body;
        const _user = await Data.findOne({ $or: [ {email}, {username} ]});
        if(!_user)
            return res.status(404).send({ status: false, message : "you are not user stop!" });
        const _role = _user.role;
        let match = await bcrypt.compare(password, _user.password)
        if(!match)
            return res.status(401).send({ status: false, message: "password or email invalid"});
        let access_token = await jwt.sign({ 
            sub: _user.username, 
            id: _user.id,
            role: _role,
            address: { 
                country: _user.country,
                city: _user.city,
                district: _user.district
            },
            language: _user.language
        }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
        return res.status(200).send({ status: true, message: "token was created", data: access_token })
   } catch (error) {
        return res.status(500).send({ status: false, message: `User Login ${error}`});
   }
}
module.exports = route