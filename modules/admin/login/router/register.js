const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/admins")


const route = async (req, res, next) => {
    try {
        let { file , body } = req;
        let { email, username, password } = body;
        const result = await Data.findOne({ $or: [ { email }, { username }] });
        if(result)
            return res.status(500).send({ status: false, message: "email or username already exists"})
        // storage
        let str = await storage.upload(file,username);
        if(str.status !== 200)
            return res.status(str.status).send({ status: false, message : str.message })
        const hash = await bcrypt.hash(password, 10);
        const _user = await new Data({
            ...req.body,
            password:hash,
            img: str.publicUrl
        });
        await _user.save();
        return res.status(200).send({ status: true, message: "admin register success"})
    } catch (error) {
       return res.status(500).send({ status: false, message: `Admin Register ${error}`});
    }
}

module.exports = route