const jwt = require("jsonwebtoken");
const { getEnv } = require("../config");
const { getError } = require("../helper_functions/helpers");
const { getAdminFromId } = require("../database_queries/auth");

module.exports = async function(req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(403).send(getError("Access Denied!"));
    }
    try {
        const verified = jwt.verify(token, getEnv("ADMIN_JWT_SECERET"));
        const { admin_id } = verified;
        const chkAdmin = await getAdminFromId(admin_id);
        if (!chkAdmin) {
            return res.status(404).send(getError("Unauthorized..! Please refresh your token."));
        }
        req.admin = chkAdmin;
        next();
    } catch (catchError) {
        if (catchError && catchError.message) {
            return res.status(400).send(getError(catchError.message));
        }
        return res.status(400).send(getError("Invalid token!."));
    }
};