const multer = require("multer");
const path = require("path");
const AppError = require("../utils/appError");
const storage = multer.memoryStorage();

module.exports = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		// console.log(ext);
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
			cb(
				new AppError(
					"Image type is not supported. Only png jpg jpeg is allowed",
					415
				),
				false
			);
			return;
		}
		cb(null, true);
	},
});
