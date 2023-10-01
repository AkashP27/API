const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config({ path: "./config.env" });

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: true,
		// useFindAndModify: true,
	})
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

app.use("/payment", require("./payment"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
