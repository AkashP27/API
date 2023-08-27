const router = require("express").Router();
const Image = require("./models/Image");
const upload = require("./utils/multer");
const s3 = require("./utils/aws");

const {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

router.post("/", upload.single("image"), async (req, res) => {
	// console.log(req.file);

	const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
	const newFileName = req.file.originalname.split(".")[0] + "-" + uniqueSuffix;
	// console.log(newFileName);

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: newFileName,
		Body: req.file.buffer,
		ContentType: req.file.mimetype,
	};

	const command = new PutObjectCommand(params);
	await s3.send(command);

	const newImage = new Image({
		name: req.body.name,
		image_id: newFileName,
		imageURL: undefined,
	});

	await newImage.save();

	res.status(201).json({
		status: "success",
		newImage,
	});
});

router.get("/", async (req, res) => {
	try {
		const images = await Image.find();

		for (let image of images) {
			const getObjectParams = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: image.image_id,
			};

			const command = new GetObjectCommand(getObjectParams);
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

			image.imageURL = url;

			await image.save();
		}

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
		const image = await Image.findById(req.params.id);

		if (!image) {
			return res.status(404).json("Image not found");
		}

		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: image.image_id,
		};

		const command = new DeleteObjectCommand(params);
		await s3.send(command);

		await image.deleteOne();

		res.status(204).json("Image deleted successfully");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
