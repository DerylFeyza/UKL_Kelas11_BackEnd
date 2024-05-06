const jsonwebtoken = require("jsonwebtoken");
const authVerify = async (req, res, next) => {
	try {
		const header = req.headers.authorization;
		if (header == null) {
			return res.status(401).json({
				message: "missing token",
				err: null,
			});
		}

		let token = header.split(" ")[1];
		let decodedToken;
		try {
			decodedToken = jsonwebtoken.verify(token, process.env.SECRET);
		} catch (error) {
			if (error instanceof jsonwebtoken.TokenExpiredError) {
				return res.status(400).json({
					message: "token expired",
					err: error,
				});
			}
			return res.status(400).json({
				message: "invalid token",
				err: error,
			});
		}

		req.adminData = decodedToken;
		next();
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error,
		});
	}
};
module.exports = { authVerify };
