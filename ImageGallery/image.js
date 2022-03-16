const router = require("express").Router();
const cloudinary = require("./cloudinary");
const upload = require("./multer");
const Image = require("./model/Image");

router.post("/", upload.single("image"), async (req, res) => {
 try {
  // Upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
   folder: "ImageGallery",
  });

  // Create new image
  let images = new Image({
   name: req.body.name,
   cloudinary_id: result.public_id,
  });

  // Save image
  await images.save();
  res.json(images);
 } catch (err) {
  console.log(err);
 }
});

router.get("/", async (req, res) => {
 try {
  let images = await Image.find();
  res.json(images);
 } catch (err) {
  console.log(err);
 }
});

module.exports = router;
