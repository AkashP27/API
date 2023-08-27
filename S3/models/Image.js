const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	name: {
		type: String,
	},

	imageURL: {
		type: String,
	},

	image_id: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Image", imageSchema);
