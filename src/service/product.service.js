const productRepo = require('../db/repository/product.repository');
const logger = require('../utils/logger');

const moduleName = 'product.service.js -';

exports.calculateTotalPrice = async (items) => {
    try {
        const ids = items.map(item => {
            item.id
        });

        const prices = await productRepo.getProductPricesByIds(ids);

        if (!prices) {
            logger.error(`${moduleName} calculate total price no response from db`);
            return;
        }
    
        let totalPrice = 0;
        prices.forEach(price => {
            totalPrice += price;
        });
    
        return totalPrice;
    } catch (err) {
        logger.error(`${moduleName} unexpected error on calculate total price ${JSON.stringify(err)}`);
        return;
    }
};

exports.updateStock = async (items) => {
    try {
        const itemsForUpdate = {
            items: [],
            ids: [],
        };
        
        items.forEach(item => {
            itemsForUpdate.items.push(item.productId, item.quantity);
            itemsForUpdate.ids.push(items.productId);
        });

        const updated = await productRepo.updateStock(itemsForUpdate);
        
        if(!updated) {
            logger.error(`${moduleName} update stock no response from db`);
            return;
        }

        // Controller runs a check on this
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update stock ${JSON.stringify(err)}`);
        return;
    }
};