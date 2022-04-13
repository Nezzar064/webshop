const contactInfoService = require("../service/contactInfo.service");
const logger = require("../utils/logger");

const moduleName = 'contactInfo.controller.js -';

exports.updateContactInfo = async (req, res) => {
    try {
        if (!req.body) {
            logger.error(`${moduleName} empty body received`);
            return res.status(400).send({message: 'Please provide a body!'});
        }

        const updated = await contactInfoService.updateContactInfo(req.params.id, req.body);

        if (!updated) {
            logger.error(`${moduleName} failed to update contact info ${req.params.id}, ${JSON.stringify(req.body)}`);
            return res.status(404).send({message: `Contact info ${req.params.id} not present!`});
        }

        logger.debug(`${moduleName} successfully updated contact info ${req.params.id}`);
        res.status(204).send(updated);

    } catch (e) {
        logger.error(`${moduleName} unexpected error during update contact info ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};

exports.deleteContactInfo = async (req, res) => {
    try {
        const deleted = await contactInfoService.delete(req.params.id);

        if (!deleted) {
            logger.error(`${moduleName} failed to delete contact info ${req.params.id}`);
            return res.status(500).send({message: 'Failed to delete contact info!'});
        }

        logger.debug(`${moduleName} successfully deleted contact info ${JSON.stringify(req.params.id)}`);
        return res.status(204).send({message: `Contact info ${req.params.id} successfully deleted!`});

    } catch (e) {
        logger.error(`${moduleName} unexpected error during delete contact info ${JSON.stringify(e)}`);
        return res.status(500).end();
    }
};