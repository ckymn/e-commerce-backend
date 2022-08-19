const Joi = require("joi");

const register = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  img: Joi.string(),
  menu_permission: Joi.array(),
});

const badWords = Joi.object({
  words: Joi.array().min(1).max(100).required().unique(),
});

module.exports = {
  register,
  badWords
};