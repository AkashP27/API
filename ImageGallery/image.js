const router = require("express").Router();
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const Image = require("./model/Image");

router.post("/", upload.single("image"), async (req, res) => {
	// console.log(req.file.path);
	try {
		// Upload image to cloudinary
		const result = await cloudinary.uploader.upload(req.file.path, {
			folder: "ImageGallery",
		});

		// Create new image
		let newImage = new Image({
			name: req.body.name,
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

router.delete("/:id", async (req, res) => {
	try {
		// console.log(req.params.id);
		const image = await Image.findById(req.params.id);
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
