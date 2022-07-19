const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const rn = require("random-number");
const trimRequest = require("trim-request");
const Mailer = require("../node_mailer/mailer");
const {
    getUserFromId,
    getUserFromEmail,
    getUserFromOtpTable,
} = require("../database_queries/auth");
const {
    sendOtpForgotPassword,
    verifyOtpForgotPassValidation,
    updateForgotPasswordValidation,
} = require("../joiValidation/validate");
const {
    getError,
    getSuccessData,
    timeExpired,
} = require("../helper_functions/helpers");

router.post("/sendOtpForgotPassword", trimRequest.all, async (req, res) => {
    const {
        error,
        value
    } = sendOtpForgotPassword(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const {
        email: _email
    } = value;
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
    if (chkEmail?.user_email != email || chkEmail?.is_registered != true) {
        return res.status(404).send(getError("Email not found."));
    }
    if (chkEmail?.logged_in_service == "SOCIAL") return res.status(404).send(getError("Social accounts cannot change password"));
    const random = rn.generator({
        min: 1111,
        max: 9999,
        integer: true,
    })();
    const existingOtp = await getUserFromOtpTable(email);
    await Mailer.sendMail(
        email,
        "Otp Verification",
        `Dear user, Your otp code is:${random} which is valid for 5 minutes.`,
    )
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
});

router.post("/verifyOtpForgotPassword", trimRequest.all, async (req, res) => {
    const { error, value } = verifyOtpForgotPassValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { email: _email, otp } = value;
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
    if (!chkEmail) return res.status(404).send(getError("Email not found."));
    if (chkEmail?.is_registered != true) return res.status(404).send(getError("Please register first."));
    if (chkEmail?.logged_in_service == "SOCIAL") return res.status(404).send(getError("Email already taken."));
    const existingOtp = await getUserFromOtpTable(email);
    if (!existingOtp) return res.status(404).send(getError("No otp issued on this email address."));
    // if (existingOtp?.otpcode != otp) return res.status(404).send(getError("Otp does not match."));
    if (timeExpired({ time: existingOtp.updated_at, p_minutes: 5 })) {
        await deleteOtp(existingOtp.otp_id);
        return res.status(404).send(getError("Otp is expired."));
    }
    const updateOtpStatus = await prisma.otp.update({
        where: {
            otp_id: existingOtp.otp_id
        },
        data: {
            is_email_verified: true,
        },
    });
    return res.status(200).send(getSuccessData("Otp verified successfully"));
});

router.post("/updatePassword", trimRequest.all, async (req, res) => {
    const { error, value } = updateForgotPasswordValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { email: _email, password } = value;
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
    if (!chkEmail) return res.status(404).send(getError("Email not found."));
    if (chkEmail?.is_registered != true) return res.status(404).send(getError("Please register first."));
    if (chkEmail?.logged_in_service == "SOCIAL") return res.status(404).send(getError("Email already taken."));
    const chkUser = await getUserFromOtpTable(email);
    if (!chkUser) return res.status(404).send(getError("Email not found."));
    if (chkUser?.is_email_verified != true) return res.status(404).send(getError("Please verify otp first."));

    const updatePassword = await prisma.users.update({
        where: {
            user_id: chkEmail.user_id,
        },
        data: {
            user_password: password,
        },
    });
    if (updatePassword) {
        await prisma.otp.delete({
            where: {
                otp_id: chkUser.otp_id,
            }
        });
        return res.status(200).send(getError("Password updated successful."));
    }
    
});



module.exports = router;