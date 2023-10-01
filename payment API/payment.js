const router = require("express").Router();
var crypto = require("crypto");
const Payment = require("./model/Payment");
const instance = require("./utils/razorpay");
const AppError = require("./utils/appError");

router.post("/create-order", async (req, res) => {
	try {
		// console.log(req.body);
		const receipt = Math.floor(Math.random() * 50000);
		var options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: "order_rcptid_" + receipt,
		};

		const order = instance.orders.create(options, async (err, order) => {
			// console.log(order);
			// save into DB
			const newPayment = await Payment.create({
				orderId: order.id,
				amount: order.amount / 100,
				receipt: order.receipt,
				paymentId: undefined,
				status: order.status,
			});

			// send orderID to checkout
			res.send({ order });
		});
	} catch (err) {
		console.log(err);
	}
});

const verifySignature = (req, res, next) => {
	// console.log(req.body);
	body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
	var expectedSignature = crypto
		.createHmac("sha256", process.env.KEY_SECRET)
		.update(body.toString())
		.digest("hex");

	// console.log("signature: " + req.body.razorpay_signature);
	// console.log("signature: " + expectedSignature);

	if (expectedSignature !== req.body.razorpay_signature) {
		return next(new AppError("Invalid signature", 400));
	}

	next();
};

router.post("/update-order", verifySignature, async (req, res) => {
	try {
		// console.log(req.body);
		const payment = await Payment.findOne({
			orderId: req.body.razorpay_order_id,
		});

		if (!payment) {
			return next(new AppError("Not found", 404));
		}

		payment.paymentId = req.body.razorpay_payment_id;
		payment.status = req.body.status;
		await payment.save();

		res.status(200).json({
			status: "success",
			message: "Payment Done",
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
