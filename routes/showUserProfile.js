const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
  filterValidation,
  getUserProfile,
} = require("../joiValidation/validate");
const { getError, getSuccessData } = require("../helper_functions/helpers");
const { AdminApproval } = require("@prisma/client");

router.get("/myProfile", trimRequest.all, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const myProfile = await prisma.users.findFirst({
      where: {
        user_id,
        is_registered: true,
        admin_approval: AdminApproval.APPROVED,
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        birthday: true,
        country: true,
        nationality: true,
        height: true,
        profile_picture: true,
        referal_id: true,
        interested_in: true,
        religion: true,
        gender: true,
        have_kids: true,
        smoking: true,
        city: true,
        bio: true,
        education: true,
        show_private_pictures: true,
        notifications: true,
        account_types: true,
        user_passions: {
          select: {
            passions_id: true,
            passions: true,
          },
        },
        user_pictures: {
          select: {
            gallery_id: true,
            picture_url: true,
          },
          orderBy: {
            updated_at: "desc",
          },
        },
      },
    });
    return res.status(200).send(getSuccessData(myProfile));
  } catch (error) {
    if (error) {
      return res.status(404).send(getError(error));
    }
  }
});

router.post("/getUserProfile", trimRequest.all, async (req, res) => {
  try {
  const { user_id } = req.user;
  const { error, value } = getUserProfile(req.body);
  if (error) {
    return res.status(404).send(getError(error.details[0].message));
  }
  const { userId } = value;
  const myProfile = await prisma.users.findFirst({
    where: {
      user_id: userId,
      is_registered: true,
      admin_approval: AdminApproval.APPROVED,
    },
    select: {
      user_id: true,
      user_email: true,
      fname: true,
      lname: true,
      birthday: true,
      country: true,
      nationality: true,
      bio: true,
      gender: true,
      height: true,
      profile_picture: true,
      show_private_pictures: true,
      account_types: true,
      interested_in: true,
      city: true,
      have_kids: true,
      smoking: true,
      other_info: true,
      looking_for_something: true,
      education: true,
      religion: true,
      user_passions: {
        select: {
          passions_id: true,
          passions: true,
        },
      },
      user_pictures: {
        select: {
          gallery_id: true,
          picture_url: true,
        },
        orderBy: {
          updated_at: "desc",
        },
      },
      likes: {
        where: {
          to_id: user_id,
        },
      },
      likers: {
        where: {
          from_id: user_id,
        },
      },
      i_super_likes: {
        where: {
          to_id: user_id,
        },
      },
      super_likes_on_me: {
        where: {
          from_id: user_id,
        },
      },
    },
  });
  // for hiding gallery in case of private gallery
  // if (!myProfile.show_private_pictures) {
  //      myProfile.user_pictures = [];
  //      delete myProfile.user_pictures;
  // }

  if (myProfile?.likers?.length > 0) {
    myProfile.is_liked = true;
    delete myProfile.likers;
  } else {
    myProfile.is_liked = false;
    delete myProfile.likers;
  }
  if (myProfile?.super_likes_on_me?.length > 0) {
    myProfile.is_super_liked = true;
    delete myProfile.super_likes_on_me;
  } else {
    myProfile.is_super_liked = false;
    delete myProfile.super_likes_on_me;
  }
  return res.status(200).send(getSuccessData(myProfile));
  } catch (error) {
    if (error) {
      return res.status(404).send(getError(error));
    }
  }
});

module.exports = router;
