const dotenv = require("dotenv");
const cors  = require('cors')
dotenv.config({ path: "./.env" });
require("./config/db");

const express = require("express");
const router = require("./router/index");
const { HandleError } = require("./middleware/errorHandler");

// const { webhookRoute } = require("./router/webhookRoute");

const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

app.use(express.json());
// for using data from req body;
app.use(cors({
  origin:"*"
}));


app.use("/", router);
app.use(HandleError);

app.listen(PORT, () => {
  console.log(`app listing on PORT ${PORT}`);
});
