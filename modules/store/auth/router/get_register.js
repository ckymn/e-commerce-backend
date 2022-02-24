const route = async (req,res,next) => {
    try {
        return res.status(200).send({ status: true, message: "Store Register Page"})
    } catch (error) {
        return res.status(500).send({ status: false, message: `Login Page : ${error} `})        
    }
};

module.exports = route;