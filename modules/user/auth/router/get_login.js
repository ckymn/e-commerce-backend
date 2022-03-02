
const route = async(req,res,next) => {
    return res.status(200).send({ status: true, message: "User Login Page Success"})
}

module.exports = route