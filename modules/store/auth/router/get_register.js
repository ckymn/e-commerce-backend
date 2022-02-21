const { Sector } = require("../../../admin/sector/model")

const route = async (req,res,next) => {
    try {
        await Sector.findOne({ _id: "61d543adf1e9cd4fed4914f6"}).lean().exec((err,data) => {
            if(err)
                return res.status(400).send({ status:false, message: "Store get_login Get Sector failed "})
            return res.status(200).send({ status: true, message: "Store Login Page Success", data: data})
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: `Login Page : ${error} `})        
    }
};

module.exports = route;