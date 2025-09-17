const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbGenerate = require("./config/dbGenerator");
const UserRoute = require("./routes/userRoute");
const ItemRoute = require("./routes/itemRoute");
const CategoryRoute = require("./routes/categoryRoute");
const UnitOfMeasurementRoute = require("./routes/unitOfMeasurementRoute");
const path = require("path")

require("dotenv").config();

global.__basedir = path.resolve(__dirname);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// dbGenerate()

// routes
app.use(UserRoute);
app.use(ItemRoute);
app.use(CategoryRoute);
app.use(UnitOfMeasurementRoute);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("Server listening on " + PORT);
});
