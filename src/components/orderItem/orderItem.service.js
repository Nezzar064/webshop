const orderItemRepo = require('./orderItem.repository');
const {service: productService} = require('../product');
const db = require("../../config/db.config");
const {AppError} = require("../../error");

exports.findAllByOrderId = async (orderId) => {

    return await orderItemRepo.findAllByOrderId(orderId);
};

exports.findById = async (id) => {
    return await orderItemRepo.findById(id);
};

exports.delete = async (orderId, id) => {
    const transaction = await db.sequelize.transaction();

    const orderItem = await orderItemRepo.findQuantityAndProductIdById(id);

    const updatedProduct = await productService.updateStockOnDeleteOrderItem(orderItem.productId, orderItem.quantity, transaction);
    const deletedOrderItem = await orderItemRepo.delete(orderId, id);

    if (!updatedProduct || !deletedOrderItem) {
        await transaction.rollback();
        throw new AppError('Failed to delete order item!', 500, true);
    }

    await transaction.commit();

    return {message: `Order item ${id} successfully deleted!`};
};
