const Data = require("../model")
const bcrypt = require("bcryptjs")

const route = async (req,res,next) => {
    try {
        let { adminData , params , body } = req;
        let { password , menu_permissions } = body;

        let hash = await bcrypt.hash(password, 10);
        if(adminData.role[0] === "admin"){
           await Data.updateOne({  _id: params.id },
            {
                $set: {
                    ...body,
                    password: hash,
                    menu_permissions: menu_permissions.map(i => i)
                }
            }).lean().exec((err,data) => {
                    if(err)
                        return res.status(400).send({ status: false, message: `Sub Admin Update by Admin failed : ${err}`})
                    return res.status(200).send({ status: true, message: "Sub Admin Update by Admin is success "})
            })
        }else{
            return res.status(400).send({ status: false, message: "You are not admin "})
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
