const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// dotenv.config();
dotenv.config({ path: "./config.env" });

let instance = new Razorpay({
 key_id: process.env.KEY_ID, //  `KEY_ID`
 key_secret: process.env.KEY_SECRET, //  `KEY_SECRET`
});

app.get("/", (req, res) => {
 res.sendFile("payment.html", { root: __dirname });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/payment/order", (req, res) => {
 params = req.body;
 instance.orders
  .create(params)
  .then((data) => {
   res.send({ sub: data, status: "success" });
  })
  .catch((error) => {
   res.send({ sub: error, status: "failed" });
  });
});

app.post("/api/payment/verify", (req, res) => {
 body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
 var crypto = require("crypto");
 var expectedSignature = crypto
  .createHmac("sha256", process.env.KEY_SECRET)
  .update(body.toString())
  .digest("hex");
 console.log("signature" + req.body.razorpay_signature);
 console.log("signature" + expectedSignature);
 var response = { status: "failure" };
 if (expectedSignature === req.body.razorpay_signature)
  response = { status: "success" };
 res.send(response);
});

app.listen("3000", () => {
 console.log("server running at port 3000");
});
