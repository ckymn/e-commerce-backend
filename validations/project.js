const Joi = require("joi")

const createValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  password2: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  img: Joi.string(),
  menu_permission: Joi.string(),
});

module.exports = {
    createValidation,
}