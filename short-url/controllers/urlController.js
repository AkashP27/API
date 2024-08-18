const URL = require("../models/url");

exports.generateShortURL = async (req, res) => {
	try {
		if (!req.body.originalURL)
			return res.status(400).json({ error: "URL is required" });

		const shortURL = Math.random().toString(36).substring(2, 8);

		await URL.create({
			original_url: req.body.originalURL,
			shorten_url: shortURL,
		});

		return res.json({
			shortUrl: shortURL,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getAnalytics = async (req, res) => {
	try {
		const result = await URL.findOne({ shorten_url: req.params.shortURL });

		if (!result) {
			return res.status(404).json({ error: "shortURL not found" });
		}

		return res.status(200).json({
			totalClicks: result.totalClicks,
			analytics: result.analytics,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
