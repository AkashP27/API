const router = require("express").Router();
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const Image = require("./model/Image");
const AppError = require("./utils/appError");

router.post("/upload", upload.single("image"), async (req, res, next) => {
	// console.log(req.file);
	if (!req.file) {
		return next(new AppError("Please upload a file", 422));
	}

	const b64 = Buffer.from(req.file.buffer).toString("base64");
	let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

	try {
		// Upload image to cloudinary
		const result = await cloudinary.uploader.upload(dataURI, {
			folder: "ImageGallery",
		});

		// Create new image
		let newImage = new Image({
			name: req.file.originalname.split(".")[0],
			imageURL: result.secure_url,
			cloudinary_id: result.public_id,
		});

		// Save image
		await newImage.save();

		res.status(201).json({
			status: "success",
			newImage,
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/", async (req, res) => {
	try {
		let images = await Image.find();
		res.status(200).json({
			status: "success",
			images,
		});
	} catch (err) {
		console.log(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		// console.log(req.params.id);
		const image = await Image.findById(req.params.id);
		if (!image) {
			return next(new AppError("Image is not found", 404));
		}

		await cloudinary.uploader.destroy(image.cloudinary_id);
		await image.delete();
		res.status(204).json({
			status: "Image deleted",
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
