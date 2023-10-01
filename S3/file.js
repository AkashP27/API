const router = require("express").Router();
const File = require("./models/File");
const upload = require("./utils/multer");
const s3 = require("./utils/aws");
const AppError = require("./utils/appError");

const {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

router.post("/", upload.single("file"), async (req, res) => {
	try {
		// console.log(req.file);
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const newFileName =
			req.file.originalname.split(".")[0] + "-" + uniqueSuffix;
		// console.log(newFileName);

		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: newFileName,
			Body: req.file.buffer,
			ContentType: req.file.mimetype,
		};

		const command = new PutObjectCommand(params);
		await s3.send(command);

		const newFile = new File({
			name: req.body.name,
			file_id: newFileName,
			fileURL: undefined,
		});

		await newFile.save();

		res.status(201).json({
			status: "success",
			newFile,
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/", async (req, res) => {
	try {
		const files = await File.find();

		for (let file of files) {
			const getObjectParams = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: file.file_id,
			};

			// console.log(getObjectParams);

			const command = new GetObjectCommand(getObjectParams);
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

			file.fileURL = url;
			await file.save();
		}

		res.status(200).json({
			status: "success",
			files,
		});
	} catch (err) {
		console.log(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const file = await File.findById(req.params.id);

		if (!file) {
			return next(new AppError("File not found", 404));
		}

		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: file.file_id,
		};

		const command = new DeleteObjectCommand(params);
		await s3.send(command);
		await file.deleteOne();

		res.status(204).json({
			status: "success",
			message: "File deleted successfully",
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
