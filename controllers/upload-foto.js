const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./fotomakanan");
	},

	filename: (req, file, cb) => {
		const foodName = req.body.name.replace(/\s/g, "-").toLowerCase();
		const timestamp = Date.now();
		const extension = path.extname(file.originalname);
		const filename = `${timestamp}-${foodName}${extension}`;
		cb(null, filename);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`];
		if (!acceptedType.includes(file.mimetype)) {
			cb(null, false);
			return cb(`Invalid file type(${file.mimetype})`);
		}

		const fileSize = req.headers[`content-length`];
		const maxSize = 1 * 1024 * 1024;
		if (fileSize > maxSize) {
			cb(null, false);
			return cb("file too large");
		}
		cb(null, true);
	},
});

module.exports = upload;
