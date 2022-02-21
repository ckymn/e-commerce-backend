const User = require("../../auth/model");
const sendEmail  = require("../../../../utils/sendEmail")

const route = async (req, res, next) => {
    try {
        const { email , code , newPassword, newPasswordAgain } = req.body;
        const genereate_code =  Math.floor(100000 + Math.random() * 900000);
        const _user = await User.findOne({ email })
        if(!_user)
            res.status(404).send({ status: false, message: "user with given email doesn't exist"})
        await new _user({
            resetCode : genereate_code
        }).save();
        await sendEmail(email,"RESET PASSWORD CODE",genereate_code);
        if(_user.resetCode !== code) 
            res.status(401).send({ status: false, message: "reset Codes don't match"})
        if(_user.resetCode === code ){
            if(newPassword !== newPassword)
                res.status(401).send({ status: false, message: "newPassword and newPasswordAgain don't match "})
            if(newPassword === newPasswordAgain)
                return res.status(200).send({ status: true, message: "Password was reset"})
        }
        return
    } catch (error) {
        console.log("forgot_password error :",error)
    }
}

module.exports = route