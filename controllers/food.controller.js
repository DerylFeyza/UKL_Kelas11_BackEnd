const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("./upload-foto").single("image");
const path = require("path");
const fs = require("fs");

exports.addFood = async (req, res) => {
	try {
		upload(req, res, async (error) => {
			if (error) {
				console.log(error);
				return res.json({ message: error });
			}
			if (!req.file) {
				return res.json({ message: "file nya dimana" });
			}

			const foodData = {
				name: req.body.name,
				spicy_level: req.body.spicy_level,
				price: parseFloat(req.body.price),
				image: req.file.filename,
			};

			const newOrder = await prisma.food.create({
				data: foodData,
			});
			return res.json({
				status: true,
				message: "new food has been inserted",
				data: newOrder,
			});
		});
	} catch (error) {
		return res.json({
			success: false,
			message: error.message,
		});
	}
};

exports.getAll = async (req, res) => {
	try {
		const products = await prisma.food.findMany();

		if (products.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		return res.json({
			status: true,
			data: products,
			message: "all Food has been retrieved",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.searchFood = async (req, res) => {
	const keyword = req.params.search;
	try {
		const products = await prisma.food.findMany({
			where: { name: { contains: keyword } },
		});

		if (products.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		return res.json({
			status: true,
			data: products,
			message: "Food has been retrieved",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.updateFood = async (req, res) => {
	try {
		upload(req, res, async (error) => {
			const id = parseInt(req.params.id);
			const unupdatedFood = await prisma.food.findUnique({
				where: { id: id },
			});

			let foodData = {
				name: req.body.name ? req.body.name : unupdatedFood.nama_barang,
				spicy_level: req.body.spicy_level
					? req.body.spicy_level
					: unupdatedFood.spicy_level,
				price: parseFloat(req.body.price)
					? parseFloat(req.body.price)
					: unupdatedFood.price,
				image: req.file ? req.file.filename : unupdatedFood.image,
			};

			if (req.file) {
				const oldPhoto = unupdatedFood.image;
				const pathPhoto = path.join(__dirname, `../fotomakanan`, oldPhoto);
				if (fs.existsSync(pathPhoto)) {
					fs.unlinkSync(pathPhoto, (error) => console.log(error));
				}
				foodData.image = req.file.filename;
			}

			const updatedFood = await prisma.food.update({
				where: { id: id },
				data: foodData,
			});
			return res.json({
				status: true,
				data: updatedFood,
				message: "food has been updated",
			});
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.deleteFood = async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const foodData = await prisma.food.findUnique({
			where: { id: id },
		});
		const oldPhoto = foodData.image;
		const pathPhoto = path.join(__dirname, `../fotomakanan`, oldPhoto);
		if (fs.existsSync(pathPhoto)) {
			fs.unlink(pathPhoto, (error) => console.log(error));
		}

		await prisma.order_detail.updateMany({
			where: { id },
			data: { food_id: null },
		});

		const deletedFood = await prisma.food.delete({
			where: { id: id },
		});
		return res.json({
			status: true,
			data: deletedFood,
			message: "Food has been deleted",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.getFoodImage = (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(__dirname, "../fotomakanan", filename);
	res.sendFile(filePath, (err) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: "Server Error" });
		}
	});
};
