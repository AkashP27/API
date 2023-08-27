const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "config.env" });

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: true,
		// useFindAndModify: true,
	})
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

app.use(express.json());

app.listen(5000, () => {
	console.log("Server is running on 5000");
});
