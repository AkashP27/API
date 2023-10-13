const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const AppError = require("./utils/appError");
const errorHandler = require("./errorHandling");
const app = express();

dotenv.config({ path: "config.env" });

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: true,
		// useFindAndModify: true,
	})
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cors());

// Route
app.use("/image", require("./image"));

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(5000, () => {
	console.log("Server is running on 5000");
});
