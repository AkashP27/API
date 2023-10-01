const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
	name: {
		type: String,
	},

	fileURL: {
		type: String,
	},

	file_id: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("File", fileSchema);
