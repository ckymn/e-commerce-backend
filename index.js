require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const router = require("./router");
const { connectDB } = require("./config/database");
const app = express();

//db
connectDB();
//mid
app.use(cors({ origin: true }));
app.use(morgan("dev"))
app.use(express.static(__dirname + "/uploads/list"))
app.use('uploads',express.static('uploads'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//engine
app.set('view engine', 'ejs');
app.set('views',__dirname)

//router
app.use(router);
//run
let PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
