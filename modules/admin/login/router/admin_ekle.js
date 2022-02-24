const Data = require("../model")
const bcrypt  = require("bcryptjs")

const route = async (req,res,next) => {
    try {
        let { adminData , body } = req;
        let { email, username, password , permission } = body;

        let result = await Data.findOne({ $or: [ { email }, { username }] }).lean();
        if(result)
            return res.status(500).send({ status: false, message: "email or username already exists"})
        const hash = await bcrypt.hash(password, 10);
        if(adminData.role[0] === "admin"){
            let _data = await new Data({
                ...body,
                role: "",
                password: hash,
                menu_permissions: permission.map(i => i)
            })
            if(!_data)
                 return res.status(400).send({ status:false, messaeg: "You can not add admin . You should be admin"})
            await _data.save();
            return res.status(200).send({ status: true, message: "Admin Add Sub Admin Success ", data: _data })
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Add Sub Admin Error, Missing Somethimes => ${error}`})
    }
};

module.exports = route;
