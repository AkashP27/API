const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	orderId: {
		type: String,
	},

	amount: {
		type: String,
		// required: true,
	},

	receipt: {
		type: String,
	},

	paymentId: {
		type: String,
	},

	status: {
		type: String,
	},
});

module.exports = mongoose.model("Payment", paymentSchema);
