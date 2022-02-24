const Data = require("../model");
const bcrypt = require("bcryptjs")

const route = async (req, res, next) => {
    try {
        let { body, adminData } = req;
        let _data = await Data.findOne({ _id: adminData.id }).lean().exec();
        let decoded = await bcrypt.compare(body.old_password,_data.password);
        if(!decoded){
            return res.status(400).send({ status: false, message: "You entered your old password incorrectly."})
        }else{
            if(body.new_password != body.new_again_password){
                return res.status(400).send({ status: false, message: "Don't match new_password and new_again_password incorrectly."})
            }else{
                let encode = await bcrypt.hash(body.new_password,10);
                let u_data = await Data.findOneAndUpdate({ _id: adminData.id }, {$set: { password: encode }},{new: true});
                if(!u_data)
                    return res.status(404).send({ status: false, message: "Update Password Don't Match Failed"})
                return res.status(200).send({ status: true, message: "Update Password Success"})
            }
        }
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Update Password, Mongo Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Update Password, Missing Somethimes => ${error}`})
    }
}

module.exports = route