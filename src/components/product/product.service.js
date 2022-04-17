const productRepo = require('./product.repository');

exports.updateStock = async (items, transaction) => {
    const ids = items.map(item => {
        return item.productId;
    });

    const updated = await productRepo.updateStock(ids, items, transaction);

    if (!updated) {
        return;
    }

    // Order service runs a check on this
    return true;
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

exports.delete = async (id) => {
    return await productRepo.delete(id);
};