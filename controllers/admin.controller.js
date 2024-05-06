const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.authentication = async (req, res) => {
	const userData = {
		email: req.body.email,
		password: req.body.password,
	};
	try {
		const user = await prisma.admin.findUnique({
			where: { email: userData.email },
		});

		if (!user) {
			return res.json({
				status: false,
				message: "Email or password doesn't match",
			});
		}

		const valid = await bcrypt.compare(userData.password, user.password);
		if (!valid) {
			return res.json({
				status: false,
				message: "Email or password doesn't match",
			});
		}

		const tokenPayLoad = {
			id_user: user.id,
			username: user.username,
			email: user.email,
		};

		let token = jsonwebtoken.sign(tokenPayLoad, process.env.SECRET);

		return res.status(200).json({
			status: true,
			logged: true,
			message: "Login Success",
			token: token,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.register = async (req, res) => {
	const userData = {
		name: req.body.username,
		email: req.body.email,
		password: await bcrypt.hash(req.body.password, 10),
	};
	try {
		const user = await prisma.admin.findUnique({
			where: { email: userData.email },
		});

		if (user) {
			return res.json({
				success: false,
				message: "Email is already in use",
			});
		}

		const newAdmin = await prisma.admin.create({
			data: userData,
		});

		return res.status(200).json({
			status: true,
			logged: false,
			message: "Registration Successful",
			data: newAdmin,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.getAllAdmin = async (req, res) => {
	try {
		const data = await prisma.admin.findMany({
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
		return res.status(200).json({
			status: true,
			data: data,
			message: "All admin info has been loaded",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.deleteOwnAccount = async (req, res) => {
	const userId = req.adminData.id_user;
	try {
		const data = await prisma.admin.delete({
			where: { id: userId },
		});

		if (!data) {
			return res.status(404).json({
				status: false,
				message: "User not found or already deleted.",
			});
		}

		return res.status(200).json({
			status: true,
			data: data,
			message: "Your account has been deleted",
		});
	} catch (error) {
		if (error.code === "P2025") {
			return res.status(404).json({
				status: false,
				message: "User not found or already deleted.",
			});
		} else {
			return res.status(500).json({
				message: error.message,
			});
		}
	}
};
