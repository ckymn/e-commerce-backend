const JWT = require("jsonwebtoken");


const generateAccessToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      role: user.role,
      address: {
        country: user.country,
        city: user.city,
        district: user.district,
      },
      language: user.language,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1w" }
  );
};
const generateRefreshToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      role: user.role,
      address: {
        country: user.country,
        city: user.city,
        district: user.district,
      },
      language: user.language,
    },
    process.env.JWT_REFRESH_SECRET
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};