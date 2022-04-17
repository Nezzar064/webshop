const {logger} = require('../../helpers/log');
const {AppError} = require("../../error");
const ContactInfo = require('./contactInfo.model');

const moduleName = 'contactInfo.repository.js -';

exports.update = async (orderId, contactInfo) => {
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

    if (_contactInfo[0] === 0) {
        logger.error(`${moduleName} contact info to update not found id: ${orderId}`);
        throw new AppError(`Contact info (order id: ${orderId}) not found!`, 404, true);
    }

    logger.debug(`${moduleName} updated contact info with order id ${orderId}: ${JSON.stringify(_contactInfo)}`);
    return {message: `Contact Info (order id: ${orderId}) successfully updated!`};
};

exports.deleteByOrderId = async (orderId) => {
    const deletedContactInfo = await ContactInfo.destroy({
        where: {
            orderId: orderId
        }
    });

    if (deletedContactInfo !== 1) {
        logger.error(`${moduleName} contact info to delete not found id: ${orderId}`);
        throw new AppError(`Contact info (order id: ${orderId}) not found!`, 404, true);
    }

    logger.info(`${moduleName} delete contact info success, id: ${orderId}`);
    return {message: `Contact Info (order id: ${orderId}) successfully deleted!`};

};