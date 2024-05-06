const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const bodyParser = require("body-parser");

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const adminRoute = require("./routes/admin.route");
app.use("/admin", adminRoute);
const foodRoute = require("./routes/food.route");
app.use("/food", foodRoute);
const orderRoute = require("./routes/order.route");
app.use("/order", orderRoute);

app.listen(PORT, () => {
	console.log(`icikiwir ${PORT}`);
});
