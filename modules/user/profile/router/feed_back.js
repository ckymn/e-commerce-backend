const { sendEmail } = require("../../../../utils")

const route = async (req,res,next) => {
    try {
        let { body, kuserData } = req;
        let { email, feed_back } = body;
        let _email = await sendEmail(email,`send by ${kuserData.sub}`,feed_back)
        if(_email.status != 200)
            return res.status(_email.status).send({ status: false, message: _email.message})
        return res.status(_email.status).send({ status: false, message: _email.message})
    } catch (error) {
        if(error)
            return res.status(500).send({ status: false, message: `Something Error Feed Back ${error}`})
    }
};

module.exports = route;