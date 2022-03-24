exports.verifyTokenWithNoGuard = (req, res) => {
    res.status(200).send({verified: true});
};

exports.verifyTokenWithAdminGuard = (req, res) => {
    res.status(200).send({verified: true});
};

exports.verifyTokenWithModGuard = (req, res) => {

    res.status(200).send({verified: true});
};
