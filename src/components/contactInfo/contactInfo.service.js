const contactInfoRepo = require('./contactInfo.repository');

exports.updateContactInfo = async (orderId, contactInfo) => {
    return await contactInfoRepo.update(orderId, contactInfo);
};

exports.delete = async (orderId) => {
    return await contactInfoRepo.deleteByOrderId(orderId);
};