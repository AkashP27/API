const Razorpay = require("razorpay");

module.exports = new Razorpay({
	key_id: process.env.KEY_ID, //  `KEY_ID`
	key_secret: process.env.KEY_SECRET, //  `KEY_SECRET`
});
