const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
var crypto = require("crypto");
const dotenv = require("dotenv");
const Payment = require("./model/Payment");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config({ path: "./config.env" });

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: true,
		// useFindAndModify: true,
	})
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

let instance = new Razorpay({
	key_id: process.env.KEY_ID, //  `KEY_ID`
	key_secret: process.env.KEY_SECRET, //  `KEY_SECRET`
});

app.post("/payment/create-order", async (req, res) => {
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

		res.send({ order }); // send orderID to checkout
	});
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
		return res.status(400).json("Invalid signature");
	}

	next();
};

app.post("/payment/update-order", verifySignature, async (req, res) => {
	// console.log(req.body);
	const payment = await Payment.findOne({
		orderId: req.body.razorpay_order_id,
	});

	if (!payment) {
		return res.status(400).json("Not found");
	}

	payment.paymentId = req.body.razorpay_payment_id;
	payment.status = req.body.status;

	await payment.save();

	res.status(200).json("Payment Done.");
});

app.listen("5000", () => {
	console.log("server running at port 5000");
});
