require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const router = require("./router");
const { connectDB } = require("./config/database");
const app = express();

//db
connectDB();
//cors/
var whitelist = ['http://localhost:3000/','http://localhost:8080/', 'https://vitrinint.netlify.app/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
//mid
app.use(cors(corsOptionsDelegate));
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
