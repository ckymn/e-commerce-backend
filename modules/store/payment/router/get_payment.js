// const {iyzipay, pay_form} = require("../../../../utils/iyzipay");
const { v4: uuidv4 } = require('uuid');
const { networkInterfaces } = require("os")

const route = async (req, res) => {
    try {
        res.status(200).send({ status: true, messaeg: "Payment Home Page "})
    } catch (error) {
        if (error) {
            if (error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Payment Error Cannot Upload Something Missing => ${error}` })
    }
}

module.exports = route