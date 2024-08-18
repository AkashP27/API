const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

router.post("/", urlController.generateShortURL);
router.get("/analytics/:shortURL", urlController.getAnalytics);

module.exports = router;
