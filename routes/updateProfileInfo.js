const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { getUserFromId } = require("../database_queries/auth");
const {
  updateProfile,
  updateUserPasswordValidation,
} = require("../joiValidation/validate");
const { getError, getSuccessData, createToken } = require("../helper_functions/helpers");
const {
  togglePrivatePictures,
  showNotifications,
} = require("../socket/socket");

router.post("/updateUserInfo", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = updateProfile(req.body);
    let u_p = [];
    if (error) return res.status(404).send(getError(error.details[0].message));
    const {
      fname: _fname,
      lname: _lname,
      interested_in: _interested_in,
      birthday,
      gender: _gender,
      height,
      religion: _religion,
      education: _education,
      bio,
      country: _country,
      city: _city,
      have_kids: _have_kids,
      smoking: _smoking,
      nationality: _nationality,
      other_info: _other_info,
      looking_for_something: _looking_for_something,
    } = value;
    const fname = _fname?.toLowerCase();
    const lname = _lname?.toLowerCase();
    const gender = _gender?.toLowerCase();
    const religion = _religion?.toLowerCase();
    const education = _education?.toLowerCase();
    const country = _country?.toLowerCase();
    const city = _city?.toLowerCase();
    const have_kids = _have_kids?.toLowerCase();
    const smoking = _smoking?.toLowerCase();
    const interested_in = _interested_in?.toLowerCase();
    const nationality = _nationality?.toLowerCase();
    const other_info = _other_info?.toLowerCase();
    const looking_for_something = _looking_for_something?.toLowerCase();
    const age = parseInt(birthday);
    // validating user_passions
    // if (!req.body.user_passions) {
    //   return res.status(404).send(getError("Please Select Passions."));
    // }
    
    // if (req.body.user_passions.length < 4) {
    //   console.log("Please Select Atleast 4 Passions");
    //   return res
    //     .status(404)
    //     .send(getError("Please Select Atleast 4 Passions."));
    // }
    // if (req.body.user_passions.length > 5) {
      //   console.log("You Cannot Select More Than 5 Passions.");
      //   return res
      //     .status(404)
      //     .send(getError("You Cannot Select More Than 5 Passions."));
      // }
      // END
      
      // user passions
      // if (req.body.user_passions) {
        //   req.body.user_passions.forEach((p) => {
          //     u_p.push({
            //       passions: p,
    //     });
    //   });
    // }
    // END
    const user_id = req.user.user_id;
    const findUser = await getUserFromId(user_id);
    if (!findUser) return res.status(404).send(getError("User not found."));
    const updateUserInfo = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        fname,
        lname,
        birthday: age? age : undefined,
        gender,
        height,
        religion,
        education,
        bio,
        smoking,
        interested_in,
        country,
        city,
        have_kids,
        nationality,
        other_info,
        looking_for_something,
        // user_passions: {
        //   createMany: {
        //     data: u_p,
        //   },
        // },
      },
    });
    if (updateUserInfo)
      return res
        .status(200)
        .send(getSuccessData("Your Info Updated Successfully",await createToken(updateUserInfo)));
  } catch (err) {
    if (err & err.message) return res.status(404).send(getError(err.message));
    return res.status(404).send(getError(err));
  }
});

router.post("/updateUserPassword", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = updateUserPasswordValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { old_password, new_password } = value;
    const user_id = req.user.user_id;
    const chkUser = await getUserFromId(user_id);
    if (!chkUser) {
      return res.status(404).send(getError("Unauthorized! User Not Found."));
    }
    if (chkUser.user_password != old_password) {
      return res.status(404).send(getError("Old password does not match."));
    }
    const updatePassword = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        user_password: new_password,
      },
    });
    if (updatePassword) {
      return res
        .status(200)
        .send(getSuccessData("Password update successful."));
    }
    return res
      .status(404)
      .send(getError("There is some issue please try again later."));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/show_private_pictures", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const chkStatus = await getUserFromId(user_id);
    if (!chkStatus) {
      return res.status(200).send(getSuccessData("User not found!"));
    }
    if (chkStatus.show_private_pictures == true) {
      const updateStatus = await prisma.users.update({
        where: {
          user_id,
        },
        data: {
          show_private_pictures: false,
        },
      });
      togglePrivatePictures(user_id, true);
      return res
        .status(200)
        .send(getSuccessData("You make your gallery public successfully"));
    } else {
      await prisma.users.update({
        where: {
          user_id,
        },
        data: {
          show_private_pictures: true,
        },
      });
      togglePrivatePictures(user_id, false);
      return res
        .status(200)
        .send(getSuccessData("You make your gallery private successfully"));
    }
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/notifications_toggle", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const chkStatus = await getUserFromId(user_id);
    if (!chkStatus) {
      return res.status(200).send(getSuccessData("User not found!"));
    }
    if (chkStatus.notifications == true) {
      const updateStatus = await prisma.users.update({
        where: {
          user_id,
        },
        data: {
          notifications: false,
        },
      });
      showNotifications(user_id, false);
      return res
        .status(200)
        .send(
          getSuccessData("You make your notifications disable successfully")
        );
    } else {
      await prisma.users.update({
        where: {
          user_id,
        },
        data: {
          notifications: true,
        },
      });
      showNotifications(user_id, true);
      return res
        .status(200)
        .send(
          getSuccessData("You make your notifications enable successfully")
        );
    }
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});



module.exports = router;
