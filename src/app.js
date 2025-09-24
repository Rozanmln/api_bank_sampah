const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const dbGenerate = require("./config/dbGenerator");
const UserRoute = require("./routes/userRoute");
const ItemRoute = require("./routes/itemRoute");
const CategoryRoute = require("./routes/categoryRoute");
const UnitOfMeasurementRoute = require("./routes/unitOfMeasurementRoute");
const GarbageBankRoute = require("./routes/garbageBankRoute");
const TransactionRoute = require("./routes/transactionRoute");
const path = require("path")

require("dotenv").config();

global.__basedir = path.resolve(__dirname);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use(UserRoute);
app.use(ItemRoute);
app.use(CategoryRoute);
app.use(UnitOfMeasurementRoute);
app.use(GarbageBankRoute);
app.use(TransactionRoute);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8081;
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
