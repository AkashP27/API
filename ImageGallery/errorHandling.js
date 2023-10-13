module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			err: err,
			// stack: err.stack,
		});

		// Unknown error, don't leak error details
	} else {
		console.log("ERROR", err);
		res.status(500).json({
			status: "error",
			message: "Something went very wrong.!",
		});
	}
};
