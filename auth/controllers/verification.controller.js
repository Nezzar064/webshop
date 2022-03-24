exports.verifyTokenWithNoGuard = (req, res) => {
    res.status(200).send({verified: true});
};

exports.verifyTokenWithAdminGuard = (req, res) => {
    res.status(200).send({verified: true});
};

exports.verifyTokenWithModGuard = (req, res) => {
    if (res.status)
    res.status(200).send({verified: true});
};
