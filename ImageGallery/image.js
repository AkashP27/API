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

  // Create new user
  let images = new Image({
   name: req.body.name,
   cloudinary_id: result.public_id,
  });
  // Save user
  await images.save();
  res.json(images);
 } catch (err) {
  console.log(err);
 }
});

// router.get("/", async (req, res) => {
//  try {
//   let user = await User.find();
//   res.json(user);
//  } catch (err) {
//   console.log(err);
//  }
// });

// router.delete("/:id", async (req, res) => {
//  try {
//   // Find user by id
//   let user = await User.findById(req.params.id);
//   // Delete image from cloudinary
//   await cloudinary.uploader.destroy(user.cloudinary_id);
//   // Delete user from db
//   await user.remove();
//   res.json(user);
//  } catch (err) {
//   console.log(err);
//  }
// });

// router.put("/:id", upload.single("image"), async (req, res) => {
//  try {
//   let user = await User.findById(req.params.id);
//   // Delete image from cloudinary
//   await cloudinary.uploader.destroy(user.cloudinary_id);
//   // Upload image to cloudinary
//   let result;
//   if (req.file) {
//    result = await cloudinary.uploader.upload(req.file.path);
//   }
//   const data = {
//    name: req.body.name || user.name,
//    avatar: result?.secure_url || user.avatar,
//    cloudinary_id: result?.public_id || user.cloudinary_id,
//   };
//   user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//   res.json(user);
//  } catch (err) {
//   console.log(err);
//  }
// });

// router.get("/:id", async (req, res) => {
//  try {
//   // Find user by id
//   let user = await User.findById(req.params.id);
//   res.json(user);
//  } catch (err) {
//   console.log(err);
//  }
// });

module.exports = router;
