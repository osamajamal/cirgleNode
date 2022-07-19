const router = require("express").Router();
const rn = require("random-number");
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
  sendOtpWithEmail,
  otpVerification,
  sendOtpForSimpleLogin,
  verifyOtpForSimpleLogin,
} = require("../joiValidation/validate");
const {
  getError,
  getSuccessData,
  timeExpired,
} = require("../helper_functions/helpers");
const {
  getUserFromEmail,
  getUserFromOtpTable,
  deleteOtp,
  getOtp,
} = require("../database_queries/auth");
const Mailer = require("../node_mailer/mailer");

router.post("/sendOtpForRegistration", trimRequest.all, async (req, res) => {
  try {
    const {
      error,
      value
    } = sendOtpWithEmail(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const {
      email: _email
    } = value;
    const random = rn.generator({
      min: 1111,
      max: 9999,
      integer: true,
    })();
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
    if (chkEmail?.logged_in_service == "SOCIAL" || chkEmail?.is_registered == true) {
      return res.status(404).send(getError("Email already taken."));
    }
    const existingOtp = await getUserFromOtpTable(email);
    // const sendMail = await Mailer.sendMail(
    //   email,
    //   "Otp Verification",
    //   `Dear user, Your otp code is:${random} which is valid for 5 minutes.`,
    // );
      if (existingOtp) {
        await prisma.otp.update({
          where: {
            otp_id: existingOtp.otp_id,
          },
          data: {
            otpcode: random,
            is_email_verified: false,
          },
        });
      } else {
        await prisma.otp.create({
          data: {
            otpcode: random,
            user_email: email,
          },
        });
      }
      return res
        .status(200)
        .send(
          getSuccessData(
            "Otp is sent to your Email Address, which is valid for 5 minutes."
          )
        );
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err.message));
    }
    return res.status(404).send(getError(err));
  }
});

router.post("/otpVerification", trimRequest.all, async (req, res) => {
  console.log("Iam req::::",req.body);
  try{
  const {
    error,
    value
  } = otpVerification(req.body);
  if (error) return res.status(404).send(getError(error.details[0].message));
  const {
    email: _email,
    otp
  } = value;
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
  if (chkEmail?.logged_in_service == "SOCIAL" || chkEmail?.is_registered == true) {
    return res.status(404).send(getError("Email already taken."));
    }
    const ExistingOtp = await getUserFromOtpTable(email);
    if (!ExistingOtp) return res.status(404).send(getError("No otp issued on this email address."));
    // if (ExistingOtp.otpcode != otp) return res.status(404).send(getError("Otp does not match."));
    if (timeExpired({time:ExistingOtp.updated_at , p_minutes:5})) {
      await deleteOtp(ExistingOtp.otp_id);
      return res.status(404).send(getError("Otp is expired."));
    }
    const updateOtpStatus = await prisma.otp.update({
      where: {
        otp_id: ExistingOtp.otp_id
      },
      data: {
        is_email_verified: true,
      },
    });
    if (updateOtpStatus) {
      await deleteOtp(updateOtpStatus.otp_id);
      if (chkEmail && chkEmail.is_registered == false) {
        await prisma.users.update({
          where: {
            user_id: chkEmail.user_id,
          },
          data: {
            user_email: email,
            logged_in_service: "SIMPLE",
          }
        });
        return res.status(200).send(getSuccessData("Otp Verified Successfully."));
      }
      const addUser = await prisma.users.create({
        data: {
          user_email: email,
          logged_in_service: "SIMPLE",
        },
      });
    }
    return res.status(200).send(getSuccessData("Otp Verified Successfully."));
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err.message));
    }
    return res.status(404).send(getError(err));
  }
});


module.exports = router;