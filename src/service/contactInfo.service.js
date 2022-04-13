const contactInfoRepo = require('../db/repository/contactInfo.repository');
const logger = require('../utils/logger');

const moduleName = 'contactInfo.service.js -';

exports.updateContactInfo = async (orderId, contactInfo) => {
    try {

        const updated = await contactInfoRepo.update(orderId, contactInfo);

        if(!updated) {
            logger.error(`${moduleName} update contact info no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully updated contact info by order id: ${orderId}`);
        return updated;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on update contact info ${JSON.stringify(err)}`);
        return;
    }
};

exports.delete = async (orderId) => {
    try {

        const deleted = await contactInfoRepo.deleteByOrderId(orderId);

        if(!deleted) {
            logger.error(`${moduleName} delete contact info no response from db`);
            return;
        }

        logger.debug(`${moduleName} successfully deleted contact info by order id: ${orderId}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on delete contact info ${JSON.stringify(err)}`);
        return;
    }
};