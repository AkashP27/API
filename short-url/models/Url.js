const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
	{
		original_url: {
			type: String,
			required: true,
		},
		shorten_url: {
			type: String,
			required: true,
			unique: true,
		},
		totalClicks: {
			type: Number,
			default: 0,
		},
		analytics: [
			{
				city: String,
				country: String,
				ip: String,
				date: Date,
			},
		],
	},
	{ timestamps: true }
);

const URL = mongoose.model("Url", urlSchema);

module.exports = URL;
