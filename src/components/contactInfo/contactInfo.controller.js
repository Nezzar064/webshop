const contactInfoService = require("./contactInfo.service");
const {logger} = require("../../helpers/log");
const {AppError} = require("../../error");

const moduleName = 'contactInfo.controller.js -';

exports.updateContactInfo = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
        logger.error(`${moduleName} empty body received`);
        return next(new AppError('Please provide a body!', 400, true));
    }

    const updated = await contactInfoService.updateContactInfo(req.params.id, req.body);

    if (!updated) {
        logger.error(`${moduleName} failed to update contact info`);
        return next(new AppError('Failed to update contact info!', 500, true));
    }

    logger.info(`${moduleName} successfully updated contact info ${req.params.id}`);
    res.status(200).send(updated);
};

exports.deleteContactInfo = async (req, res, next) => {
    const deleted = await contactInfoService.delete(req.params.id);

    if (!deleted) {
        logger.error(`${moduleName} failed to delete contact info`);
        return next(new AppError('Failed to delete contact info!', 500, true));
    }

    logger.info(`${moduleName} successfully deleted contact info ${JSON.stringify(req.params.id)}`);
    return res.status(200).send(deleted);

};