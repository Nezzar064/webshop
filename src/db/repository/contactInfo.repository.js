const db = require('../index');
const logger = require('../../utils/logger.js');
const ContactInfo = db.contactInfo;

const moduleName = 'contactInfo.repository.js -';

exports.update = async (orderId, contactInfo) => {
    try {
        const _contactInfo = await ContactInfo.update({
            name: contactInfo.name,
            address: contactInfo.address,
            email: contactInfo.email,
            city: contactInfo.city,
            zip: contactInfo.zip,
        }, {
            where: {
                orderId: orderId
            }
        });
        
        if (!_contactInfo) {
            logger.error(`${moduleName} contact info to update not found id: ${orderId}`);
            return;
        }

        logger.info(`${moduleName} updated contact info with order id ${orderId}: ${JSON.stringify(_contactInfo)}`);
        return _contactInfo.get({ plain: true });

    } catch (err) {
        logger.error(`${moduleName} contact info update error: ${JSON.stringify(err)}`);
        return;
    }
};

exports.deleteByOrderId = async (orderId) => {
    try {
        const deletedContactInfo = await ContactInfo.destroy({
            where: {
                orderId: orderId
            }
        });

        if (deletedContactInfo !== 1) {
            logger.info(`${moduleName} contact info to delete not found id: ${orderId}`);
            return;
        }

        logger.info(`${moduleName} delete contact info success, id: ${orderId}`);
        return true;

    } catch (err) {
        logger.error(`${moduleName} unexpected error on contact info: ${JSON.stringify(err)}`);
        return;
    }
};