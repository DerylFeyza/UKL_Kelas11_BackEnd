const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.customerOrder = async (req, res) => {
	const newOrder = {
		customer_name: req.body.customer_name,
		table_number: req.body.table_number,
		order_date: req.body.order_date,
	};

	try {
		const createdOrder = await prisma.order_list.create({
			data: newOrder,
		});

		const orderId = createdOrder.id;

		const orderDetails = [];

		for (const detail of req.body.order_detail) {
			const foodData = await prisma.food.findUnique({
				where: { id: detail.food_id },
			});

			const price = detail.quantity * foodData.price;

			orderDetails.push({
				...detail,
				order_id: orderId,
				price: price,
			});
		}

		await prisma.order_detail.createMany({
			data: orderDetails,
		});

		return res.json({
			status: true,
			data: createdOrder,
			message: "Order list has been created",
		});
	} catch (error) {
		return res.json({
			success: false,
			message: error.message,
		});
	}
};

exports.getOrderHistory = async (req, res) => {
	try {
		const orderData = await prisma.order_list.findMany();
		const ordersWithDetails = [];

		for (const order of orderData) {
			const orderDetails = await prisma.order_detail.findMany({
				where: {
					order_id: order.id,
				},
			});

			ordersWithDetails.push({
				order: order,
				order_details: orderDetails,
			});
		}
		return res.json({
			status: true,
			data: ordersWithDetails,
			message: "Order list has been retrieved",
		});
	} catch (error) {
		return res.json({
			success: false,
			message: error.message,
		});
	}
};
