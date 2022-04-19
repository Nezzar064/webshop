const productRepo = require('./product.repository');
const {AppError} = require("../../error");

exports.updateStockOnCreateOrder = async (items, transaction) => {
    const ids = items.map(item => {
        return item.productId;
    });

    const updated = await productRepo.updateStockOnCreateOrder(ids, items, transaction);

    if (!updated) {
        return;
    }

    // Order service runs a check on this
    return true;
};

exports.updateStock = async (id, stock) => {

    if (typeof stock !== "number") {
        throw new AppError(`Failed to update stock - invalid data! ${stock}`, 500, true);
    }

    return await productRepo.updateStock(id, stock);
};

exports.createProduct = async (product) => {
    return await productRepo.create(product);
};

exports.findAll = async () => {
    return await productRepo.findAll();
};

exports.updateProduct = async (id, product) => {
    return await productRepo.update(id, product);
};

exports.findById = async (id) => {
    return await productRepo.findById(id);
};

exports.updateStockOnDeleteOrderItem = async (id, quantity, transaction) => {
    return await productRepo.updateStockOnDeleteOrderItem(id, quantity, transaction);
};

exports.delete = async (id) => {
    return await productRepo.delete(id);
};