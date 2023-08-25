const multer = require("multer");
const path = require("path");

// Multer config

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

		cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix);
	},
});

module.exports = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		// console.log(ext);
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
			cb(new Error("File type is not supported"), false);
			return;
		}
		cb(null, true);
	},
});
