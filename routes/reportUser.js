const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
    reportValidation,
} = require("../joiValidation/validate");
const {
    getError,
    getSuccessData
} = require("../helper_functions/helpers");
const {
    getUserFromId
} = require("../database_queries/auth");

router.post("/reportUser", trimRequest.all, async (req, res) => {
    try {
        const reporter_id = req.user.user_id;
        const { error, value } = reportValidation(req.body);
        if (error) {
            return res.status(404).send(getError(error.details[0].message));
        }
        const { reported_id, reason } = value;
        const findUser = await getUserFromId(reported_id);
        if (!findUser) {
            return res.status(404).send(getError("User not found!"));
        }
        if (reported_id == reporter_id) {
            return res.status(404).send(getError("Action cannot perform on same IDs"));
        }
        const chkReportStatus = await prisma.reports.findFirst({
            where: {
                reporter_id,
                reported_id,
            }
        });
        if (chkReportStatus) {
            return res.status(404).send(getError("You have already reported this user!"));
        }
        const createReport = await prisma.reports.create({
            data: {
                reporter_id,
                reported_id,
                reason,
            },
        });
        if (createReport) {
            return res.status(200).send(getSuccessData("You successfully report this user."));
        }
        return res.status(404).send(getError("There is some error from server please try again later thankyou!"));
    } catch (error) {
        if (error && error.message) {
            return res.status(404).send(getError(error.message));
        }
        return res.status(404).send(getError(error));
    }
});

module.exports = router;