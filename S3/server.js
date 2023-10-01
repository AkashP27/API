const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const AppError = require("./utils/appError");
const errorHandler = require("./errorHandling");

const app = express();
app.use(express.json());

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

app.use("/file", require("./file"));

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(5000, () => {
	console.log("Server is running on 5000");
});
