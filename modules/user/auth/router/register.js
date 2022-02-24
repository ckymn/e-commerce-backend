const Data = require("../model")
const bcrypt  = require("bcryptjs")

const route = async (req, res, next) => {
    try {
        let { body } = req;
        let { email, username, password } = body;
        let _data = await Data.findOne({ $or: [ { email }, { username }] });
        if(_data)
            return res.status(500).send({ status: false, message: "email and username already exists"})
        const hash = await bcrypt.hash(password, 10);
        let _user = await new Data({
            ...body,
            password:hash,
        });
        await _user.save();
        return res.status(200).send({ status: true, message: "user register success"})
    } catch (error) {
       return res.status(500).send({ status: false, message: `User Register ${error}`});
    }
}

module.exports = route