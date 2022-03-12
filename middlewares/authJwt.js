const jwt = require("jsonwebtoken");
const ApiError = require("../errors/ApiError");

const {TokenExpiredError} = jwt;

const catchError = (err,res) => {
    if( err instanceof TokenExpiredError)
        return res.send({ status: 401, message: "A_Unauthorized! Access Token was expired!",})
    return res.send({ status: 401, message: "A_Unauthorized !"});
}

const route = async (req,res,next) => {
    let auth = req.header("Authorization");
    if(!auth)
        return res.send({ status: 401, message: "A_Unauthorized_1"});
    auth = auth.split(" ")[1];
    if(!auth)
        return res.send({ status: 401, message: "A_Unauthorized_2" });
    await jwt.verify(auth, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err)
            return catchError(err,res)
        if(decoded.role === "store"){
            console.log("store logged in")
            req.userData = decoded
            return next();
        }
        if(decoded.role[0] === "admin"){
            console.log("admin logged in")
            req.adminData = decoded
            return next();
        }
        if(decoded.role === "user"){
            console.log("user logged in")
            req.kuserData = decoded
            return next();
        }
    })
}
module.exports = route; 