const RequestIp = require("request-ip");
const { getClientIp } = require("@supercharge/request-ip");

const ip1_middleware = function (req, res, next) {  
  req.ip = RequestIp.getClientIp(req);
  next();
};

const ip2_Middleware = function (req, res, next) {
  req.ip = getClientIp(req);

  next();
};
module.exports = {ip1_middleware,ip2_Middleware};