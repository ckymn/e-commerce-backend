const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/admins")


const route = async (req, res, next) => {
    try {
        let { file , body } = req;
        let { email, username, password } = body;
        if(!file)
            return res.status(400).send({status: false, message: "Please upload a file!"})
        let _data = await Data.findOne({ $or: [ { email }, { username }] });
        if(_data)
            return res.status(500).send({ status: false, message: "email or username already exists"})
        let hash = await bcrypt.hash(password, 10);
        const _user = await new Data({
            ...req.body,
            password:hash,
        }).save();
        let str = await storage.Upload(file,_user._id);
        if(str.status !== 200)
            return res.status(str.status).send({ status: false, message : str.message })
        await Data.updateOne({ _id: _user._id},{ $set: { img: str.publicUrl }})
        return res.status(200).send({ status: true, message: "admin register success"})
    } catch (error) {
       return res.status(500).send({ status: false, message: `Admin Register ${error}`});
    }
}

module.exports = route