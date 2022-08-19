require("dotenv").config();
const { errorHandler } = require("./v2/middlewares");
const { connectDB } = require("./v2/config/database");
const createServer = require("./v2/scripts/server/index");

let PORT = process.env.APP_PORT || 8080;
const app = createServer();

//! Not Found
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
//! Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB();
});
