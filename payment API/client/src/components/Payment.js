import React, { useState, useEffect } from "react";
import "./Payment.css";

const Payment = () => {
	const [amount, setAmount] = useState("");
	const [submitButton, setSubmitButton] = useState(false);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		console.log(script.src);
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleChange = (event) => {
		const amount = event.target.value;
		setAmount(amount);
	};

	const updatePaymentOnServer = async (
		paymentId,
		orderId,
		signature,
		status
	) => {
		try {
			const res = await fetch("http://localhost:5000/payment/update-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					razorpay_payment_id: paymentId,
					razorpay_order_id: orderId,
					razorpay_signature: signature,
					status,
				}),
			});

			// console.log(res);

			if (res.status !== 200) {
				alert("Payment unsuccessfull");
			} else {
				alert("Payment successful");
			}

			setAmount("");
		} catch (error) {
			console.error(error);
			alert("server couldn't save payment");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitButton(true);

		if (amount === "" || amount === null) {
			alert("Amount is required");
			return;
		}

		try {
			const response = await fetch(
				"http://localhost:5000/payment/create-order",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ amount: amount }),
				}
			);

			const content = await response.json();
			console.log(content);

			if (content.order.status === "created") {
				let options = {
					key_id: "rzp_test_gym23pa0YynSmB",
					amount: content.order.amount,
					currency: "INR",
					name: "Payment Integration App",
					order_id: content.order.id,

					handler: (response) => {
						console.log(response);
						// console.log(response.razorpay_payment_id);
						// console.log(response.razorpay_order_id);
						// console.log(response.razorpay_signature);

						updatePaymentOnServer(
							response.razorpay_payment_id,
							response.razorpay_order_id,
							response.razorpay_signature,
							"paid"
						);
					},
					prefill: {
						name: "",
						email: "",
						contact: "",
					},
					notes: {
						address: "123 Street",
					},
					theme: {
						color: "#3399cc",
					},
				};

				let rzp = new window.Razorpay(options);

				rzp.on("payment.failed", function (response) {
					console.log(response.error.code);
					console.log(response.error.description);
					console.log(response.error.source);
					console.log(response.error.step);
					console.log(response.error.reason);
					console.log(response.error.metadata.order_id);
					console.log(response.error.metadata.payment_id);
				});

				rzp.open();

				setSubmitButton(false);
			}
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<section>
			<div className="form-box">
				<div className="form-value">
					<form action="" onSubmit={handleSubmit}>
						<h2>Make Payment</h2>
						<div className="inputbox">
							<input
								type="text"
								name="amount"
								id="amount"
								value={amount}
								onChange={handleChange}
							/>
							<label htmlFor="amount">Amount</label>
						</div>
						<button type="submit" disabled={submitButton}>
							Checkout
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Payment;
