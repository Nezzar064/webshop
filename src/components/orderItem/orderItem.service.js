const orderItemRepo = require('./orderItem.repository');

exports.findAllByOrderId = async (orderId) => {
    return await orderItemRepo.findAllByOrderId(orderId);
};

exports.findById = async (id) => {
    return await orderItemRepo.findById(id);
};

exports.delete = async (orderId, id) => {
    return await orderItemRepo.delete(orderId, id);
};
