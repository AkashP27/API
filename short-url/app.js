const express = require("express");
const mongoose = require("mongoose");
const URL = require("./models/url");
const urlRoute = require("./routes/urlRoute");

const app = express();
mongoose
	.connect("mongodb://127.0.0.1:27017/short-url")
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortURL", async (req, res) => {
	try {
		const response = await fetch("https://ipapi.co/json");
		const { city, country_name: country, ip } = await response.json();

		const result = await URL.findOne({ shorten_url: req.params.shortURL });

		if (!result) {
			return res.status(404).json({ error: "shortURL not found" });
		}

		result.analytics.push({
			city: city,
			country: country,
			ip: ip,
			date: Date.now(),
		});
		result.totalClicks++;
		await result.save();
		res.redirect(result.original_url);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`server running on ${PORT}`);
});
