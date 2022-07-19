const router = require("express").Router();
const Prisma_Client = require("../../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { adminLoginValidation } = require("../../joiValidation/validate");
const {
  getError,
  getSuccessData,
  createAdminToken,
} = require("../../helper_functions/helpers");
const { AccountTypes } = require("@prisma/client");
const { getAdminFromEmail } = require("../../database_queries/auth");
const { uploadFile, deleteFile } = require("../../s3_bucket/s3_bucket");
const { AdminApproval } = require("@prisma/client");
const { getEnv } = require("../../config");

router.post("/adminLogin", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = adminLoginValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { email: _email, password } = value;
    const email = _email.toLowerCase();

    // if (email != getEnv("ADMIN_MAIL")) {
    //     return res.status(404).send(getError("Invalid Email"));
    // }
    // if (password != getEnv("ADMIN_PASSWORD")) {
    //     return res.status(404).send(getError("Invalid Password"));
    // }
    const chkAdmin = await getAdminFromEmail(email);
    if (!chkAdmin) {
      return res.status(404).send(getError("Admin not found with this email"));
    }
    if (chkAdmin.admin_email != email) {
      return res.status(404).send(getError("Invalid Email Address."));
    }
    if (chkAdmin.admin_password != password) {
      return res.status(404).send(getError("Invalid Password."));
    }
    return res.status(200).send(getSuccessData(createAdminToken(chkAdmin)));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

module.exports = router;
