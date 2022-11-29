const express = require("express");
const router = express.Router();
const videoRouter = require("./routes/video");

const app = express();

//Routes
app.use("/", videoRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
