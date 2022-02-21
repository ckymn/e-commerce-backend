const route = async (req,res,next) => {
    try {
        return res.status(200).send({ status: true, messag: "Login Page Succes "})
    } catch (error) {
        return res.status(500).send({ status: false, message: `Login Page : ${error}`})        
    }
};

module.exports = route;