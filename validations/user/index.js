const Joi = require("joi");

const register = Joi.object().keys({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  type: Joi.string().required().valid("Point"),
  coordinates: [
    {
      long: Joi.number().precision(8),
      lat: Joi.number().precision(8),
    },
  ],
});

module.exports = {
  register,
};
