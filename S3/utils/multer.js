const multer = require("multer");
const path = require("path");
const AppError = require("../utils/appError");
const storage = multer.memoryStorage();

module.exports = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);

		if (
			ext !== ".jpg" &&
			ext !== ".jpeg" &&
			ext !== ".png" &&
			ext !== ".svg" &&
			ext !== ".pdf" &&
			ext !== ".txt" &&
			ext !== ".xlsx" &&
			ext !== ".xls" &&
			ext !== ".docx" &&
			ext !== ".doc"
		) {
			cb(
				new AppError(
					"File type is not supported. Only png jpg jpeg is allowed",
					415
				),
				false
			);
			return;
		}
		cb(null, true);
	},
});
