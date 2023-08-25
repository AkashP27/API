const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	imageURL: {
		type: String,
		required: true,
	},
	cloudinary_id: {
		type: String,
	},
});

module.exports = mongoose.model("Image", imageSchema);
