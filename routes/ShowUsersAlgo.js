const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { findUserId } = require("../joiValidation/validate");
const { getUserFromId } = require("../database_queries/auth");
const {
  getError,
  getSuccessData,
  getDistanceFromLatLonInKm,
} = require("../helper_functions/helpers");
var _ = require("lodash");
const { AdminApproval } = require("@prisma/client");

router.get("/HomeUsers", trimRequest.all, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    var user = req.user;
    const my_lat = user.latitude;
    const my_lon = user.longitude;
    const my_gender = user.gender;

    const homeUsers = await prisma.users.findMany({
      where: {
        OR: [
          {
            country: user.country ?? null,
            religion: user.religion ?? null,
            interested_in: user.interested_in ?? null,
          },
          {
            height: {
              lte: user?.height + 1 ? user.height + 1 : undefined,
              gte: user?.height - 1 ? user.height - 1 : undefined,
            },
          },
          {
            nationality: user.nationality ?? null,
          },
        ],
        NOT: [
          {
            user_id,
          },
          {
            gender: my_gender,
          },
          {
            user_blocked_me: {
              some: {
                blocker_id: user_id,
              },
            },
          },
          {
            user_i_block: {
              some: {
                blocked_id: user_id,
              },
            },
          },
        ],
        admin_approval: AdminApproval.APPROVED,
        is_registered: true,
      },
      select: {
        user_id: true,
        fname: true,
        lname: true,
        profile_picture: true,
        country: true,
        nationality: true,
        gender: true,
        city: true,
        latitude: true,
        longitude: true,
        education: true,
        height: true,
        birthday: true,
        online_status: true,
        online_status_time: true,
        show_private_pictures: true,
        account_types: true,
        bio: true,
        // i_recieve_notifications: {
        //   where: {
        //     to_id: user_id,
        //   }
        // },
        // i_send_notifications: {
        //   where: {
        //     to_id: user_id,
        //   }
        // },
        user_pictures: {
          select: {
            gallery_id: true,
            picture_url: true,
          },
          orderBy: {
            updated_at: "desc",
          },
        },
        user_passions: {
          select: {
            passions_id: true,
            passions: true,
          },
        },
        // likes: {
        //   where: {
        //     to_id: user_id,
        //   },
        // },
        likers: {
          where: {
            from_id: user_id,
          },
        },
        // i_super_likes: {
        //   where: {
        //     to_id: user_id,
        //   },
        // },
        super_likes_on_me: {
          where: {
            from_id: user_id,
          },
        },
      },
      orderBy: [
        {
          online_status: "asc",
        },
        {
          online_status_time: "desc",
        },
      ],
    });
    homeUsers.forEach((arr) => {
      if (arr.latitude && arr.longitude) {
        arr.distance = getDistanceFromLatLonInKm(
          arr.latitude,
          arr.longitude,
          my_lat,
          my_lon
        );
      }
      if (arr?.likers?.length > 0) {
        arr.is_liked = true;
        delete arr.likers;
      } else {
        arr.is_liked = false;
        delete arr.likers;
      }
      if (arr?.super_likes_on_me?.length > 0) {
        arr.is_super_liked = true;
        delete arr.super_likes_on_me;
      } else {
        arr.is_super_liked = false;
        delete arr.super_likes_on_me;
      }
    });
    const sorted_users = _.orderBy(homeUsers, ["distance", "online_status"], ["asc", "desc"]);
    return res.status(200).send(getSuccessData(sorted_users));
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err.message));
    }
    return res.status(404).send(getError(err));
  }
});

module.exports = router;
