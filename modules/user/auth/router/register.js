const Data = require("../model")
const bcrypt  = require("bcryptjs")
const fs = require("fs")
const path = require("path")
const l_u = path.join(__dirname , "../../../../uploads/user");

const route = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const result = await Data.findOne({ $or: [ { email }, { username }] });
        await fs.readdir(l_u, (err,file) => {
            if(err)
                return console.log("Unable to scan directory: ", err)
            file.map(i => fs.unlink(`${l_u}/${i}`,(err) => {
                if(err) next();
                return console.log("/files deleting is success")
            }))
        })
        if(result)
            return res.status(500).send({ status: false, message: "email and username already exists"})
        const hash = await bcrypt.hash(password, 10);
        let _user = await new Data({
            ...req.body,
            password:hash,
            // img: req.file.path
        });
        await _user.save();
        return res.status(200).send({ status: true, message: "user register success"})
    } catch (error) {
       return res.status(500).send({ status: false, message: `User Register ${error}`});
    }
}

module.exports = route