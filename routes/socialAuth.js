const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
  socialSignupValidation,
  socialLoginValidation,
  fcmTokenValidation,
} = require("../joiValidation/validate");
const {
  getError,
  getSuccessData,
  createToken,
  deleteUploadedImage,
} = require("../helper_functions/helpers");
const { getUserFromEmail } = require("../database_queries/auth");
const { uploadFile, deleteFile } = require("../s3_bucket/s3_bucket");
const { AdminApproval } = require("@prisma/client");
const fs = require("fs");

// SOCIAL SIGNUP USER
router.post(
  "/socialSignup/:service",
  [uploadImage, trimRequest.all],
  async (req, res) => {
    try {
      var referal_id = Math.random().toString(36).substr(2, 7);
      let files = [];
      let u_p = [];
      const allowed_services = ["google", "facebook","apple"];
      const services = req.params["service"];
      const chkAllowedServices = allowed_services.find(
        (allowed_services) => allowed_services == services
      );
      if (!chkAllowedServices) {
        deleteUploadedImage(req);
        return res
          .status(404)
          .send(getError(`Only ${allowed_services} Services are Allowed`));
      }
      const { error, value } = socialSignupValidation(req.body);
      if (error) {
        deleteUploadedImage(req);
        return res.status(404).send(getError(error.details[0].message));
      }
      // Adding user passions
      if (!req.body.user_passions) {
        deleteUploadedImage(req);
        return res.status(404).send(getError("Please Select Passions."));
      }
      if (req.body.user_passions.length < 4) {
        deleteUploadedImage(req);
        return res
          .status(404)
          .send(getError("Please Select Atleast 4 Passions."));
      }
      if (req.body.user_passions.length > 5) {
        deleteUploadedImage(req);
        return res
          .status(404)
          .send(getError("You Cannot Select More Than 5 Passions."));
      }
      // File Errors
      if (req.file_error) {
        deleteUploadedImage(req);
        return res.status(404).send(getError(req.file_error));
      }
      if (!req.files?.["profile"]) {
        return res.status(404).send(getError("Please Select Your Profile."));
      }
      // Variables
      const {
        fname: _fname,
        lname: _lname,
        email: _email,
        birthday,
        gender: _gender,
        height,
        religion: _religion,
        interested_in: _interested_in,
        country: _country,
        nationality: _nationality,
        longitude,
        latitude,
        social_auth_id,
        refrer_id,
        fcm_token,
        bio,
      } = value;
      // Converting Values to lower case
      const email = _email.toLowerCase();
      const fname = _fname.toLowerCase();
      const lname = _lname.toLowerCase();
      const gender = _gender.toLowerCase();
      const religion = _religion.toLowerCase();
      const interested_in = _interested_in.toLowerCase();
      const country = _country.toLowerCase();
      const nationality = _nationality.toLowerCase();
      const age = parseInt(birthday);

      const chkEmail = await getUserFromEmail(email);
      if (
        chkEmail?.is_registered == true ||
        chkEmail?.logged_in_service == "SIMPLE"
      ) {
        deleteUploadedImage(req);
        return res.status(404).send(getError("Email already taken."));
      }
      // user Gallery
      // if (req.files?.['gallery']) {
      //     req.files?.["gallery"]?.forEach((file) => {
      //         const fileName = file ? file.filename : null;
      //         if (fileName) {
      //             files.push({
      //                 picture_url: fileName,
      //             });
      //         };
      //     });
      // };
      // Adding user passions
      if (req.body.user_passions) {
        req.body.user_passions.forEach((p) => {
          u_p.push({
            passions: p,
          });
        });
      }

      // Referal System
      if (req.body?.refrer_id) {
        const chkRefrer = await prisma.users.findFirst({
          where: {
            referal_id: refrer_id,
          },
        });
        if (chkRefrer) {
          const count = chkRefrer.accounts_created_on_ref;
          let update = await prisma.users.update({
            where: {
              user_id: chkRefrer.user_id,
            },
            data: {
              accounts_created_on_ref: count + 1,
            },
          });
          if (update.accounts_created_on_ref == 5) {
            const getPlans = await prisma.membershipPlans.findMany({
              orderBy: {
                plan_price: "asc",
              },
            });
            const updateToPremium = await prisma.users.update({
              where: {
                user_id: chkRefrer.user_id,
              },
              data: {
                account_types: getPlans ? getPlans[0]?.plan_name : null,
                membership_created_at: new Date(),
                membership_valid_for: getPlans
                  ? getPlans[0].plan_duration
                  : null,
              },
            });
            return res
              .status(200)
              .send(
                getSuccessData(
                  "Congratulations! You got Silver Account For a Month."
                )
              );
          }
        }
      }
      // END

      // S3 bucket for gallery
      if (req.files?.["gallery"]) {
        for (const file of req.files["gallery"]) {
          if (file) {
            let { Location } = await uploadFile(file);
            var galler_url = Location;
            files.push({
              picture_url: Location,
            });
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          }
        }
      }
      // s3 bucket for profile
      if (req.files?.["profile"]) {
        for (const file of req.files["profile"]) {
          if (file) {
            let { Location } = await uploadFile(file);
            var profile_picture = Location;
            var profile_url = Location;
          }
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
      const createUser = await prisma.users.create({
        data: {
          fname,
          lname,
          user_email: email,
          birthday: age,
          gender,
          height,
          religion,
          interested_in,
          country,
          nationality,
          longitude,
          latitude,
          fcm_token,
          social_auth_id,
          social_auth_provider: services,
          is_registered: true,
          referal_id,
          profile_picture,
          bio,
          logged_in_service: "SOCIAL",
          user_pictures: {
            createMany: {
              data: files,
            },
          },
          user_passions: {
            createMany: {
              data: u_p,
            },
          },
        },
      });
      if (createUser) {
        return res
          .status(200)
          .send(getSuccessData(await createToken(createUser)));
      } else {
        deleteFile(profile_url);
        deleteFile(galler_url);
        deleteUploadedImage(req);
        return res
          .status(404)
          .send(
            getError("There is some issue from server please try again later.")
          );
      }
    } catch (err) {
      if (err & err.message) {
        deleteFile(profile_url);
        deleteFile(galler_url);
        deleteUploadedImage(req);
        return res.status(404).send(getError(err.message));
      }
      deleteFile(profile_url);
      deleteFile(galler_url);
      deleteUploadedImage(req);
      return res.status(404).send(getError(err));
    }
  }
);

// SOCIAL LOGIN
router.post("/socialLogin/:service", trimRequest.all, async (req, res) => {
  console.log("iam body from social login:::", req.body);
  try {
    const allowed_services = ["google", "facebook","apple"];
    const services = req.params["service"];
    const chkAllowedServices = allowed_services.find(
      (allowed_services) => allowed_services == services
    );
    if (!chkAllowedServices) {
      return res
        .status(404)
        .send(getError(`Only ${allowed_services} Services are Allowed`));
    }
    const { error, value } = socialLoginValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { email: _email, social_auth_id, fcm_token } = value;
    const email = _email.toLowerCase();
    const chkEmail = await getUserFromEmail(email);
    if (chkEmail?.logged_in_service == "SIMPLE") {
      return res.status(404).send(getError("Email already taken."));
    }
    if (chkEmail?.is_registered != true || chkEmail?.user_email != email) {
      return res.status(404).send(getError("Email does not exist"));
    }
    if (chkEmail?.admin_approval === AdminApproval.PENDING) {
      return res.status(404).send(getError("Please wait to approved!"));
    }
    if (chkEmail?.admin_approval === AdminApproval.BLOCKED) {
      return res
        .status(404)
        .send(getError("Sorry.. you are blocked by admin!"));
    }
    if (chkEmail.social_auth_id != social_auth_id) {
      return res.status(404).send(getError("Invalid social id."));
    }
    if (chkEmail.social_auth_provider != services) {
      return res
        .status(404)
        .send(getError(`You are not sign-up with ${services} service.`));
    }
    const updateFcmToken = await prisma.users.update({
      where: {
        user_id: chkEmail.user_id,
      },
      data: {
        fcm_token,
      },
    });
    const user = chkEmail;
    return res.status(200).send(getSuccessData(await createToken(user)));
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err));
    }
    return res.status(404).send(getError(err.message));
  }
});

// CHECK EMAIL
router.post("/check_email", trimRequest.body, async (req, res) => {
  try {
    const { error, value } = checkEmailValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));

    const { email: _email } = value;
    const email = _email.toLowerCase();
    const emailExists = await getUserFromEmail(email);
    if (
      emailExists.is_registered == true ||
      emailExists.logged_in_service == "SIMPLE"
    ) {
      return res
        .status(404)
        .send(getError("This Email Address is Already Taken."));
    }
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(404).send(getError(catchError.message));
    }
    return res.status(404).send(getError(catchError));
  }
});

module.exports = router;
