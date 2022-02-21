const { Schema, Mongoose, model } = require("mongoose")

const admin_reset_password = new model("admin_register", new Schema({
    username : { type: Schema.Types.String, require: true },
    email : { type: Schema.Types.String, require: true },
    password : { type: Schema.Types.String, require: true },
    password_again : { type: Schema.Types.String, require: true }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))

module.exports = admin_reset_password;