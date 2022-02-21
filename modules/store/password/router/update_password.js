const User = require("../../auth/model")

const route = async (req, res, next) => {
    try {
    let  { _client } = req;
    const { old_password, new_password, new_password_again } = req.body;
    let _user = await User.findById(_client)
    if(!_user)
        res.status(404).send({ status: false, message: "user was not founded"})
    if(old_password !== _user.password)
        res.status(401).send({ status: false, message: "user do not match"})
    if(old_password === _user.password){
        if(new_password !== new_password_again)
            res.status(401).send({ status: false, message: "new_password and new_password_again do not match"})
        let doc = await User.findOneAndUpdate({ _id: _client}, { password : new_password}, { new: true })
        console.log("update_password doc :", doc)
    }
    } catch (error) {
        console.log("update_password error :", error)
    }
}

module.exports = route