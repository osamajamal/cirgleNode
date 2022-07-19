const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const { getError, getSuccessData } = require("../helper_functions/helpers");
const { AdminApproval } = require("@prisma/client");

router.get("/getMyNotifications", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const getMyNotifications = await prisma.users.findFirst({
      where: {
        user_id,
        admin_approval: AdminApproval.APPROVED,
      },
      select: {
        i_recieve_notifications: {
          where: {
            to_id: user_id,
            // seen: false,
          },
          select: {
            notification_type: true,
            created_at: true,
            seen: true,
            sender: {
              select: {
                user_id: true,
                fname: true,
                lname: true,
                profile_picture: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    const notifications = getMyNotifications?.i_recieve_notifications;
    let Notification_count = 0;
    for (let i = 0; i < notifications?.length; i++) {
      if (notifications[i]?.seen == false) {
        Notification_count++;
      }
    }
    return res.status(200).send(
      getSuccessData({
        notifications,
        Notification_count,
      })
    );
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/seenNotifications", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const makeNotificationsSeen = await prisma.notifications.updateMany({
      where: {
        to_id: user_id,
      },
      data: {
        seen: true,
      },
    });
    if (makeNotificationsSeen.count <= 0) {
      return res.status(404).send(getError("No data found"));
    }
    return res
      .status(200)
      .send(getSuccessData("Notifications Seen Successfull"));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
  }
});

router.post("/delete_fcm_token", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const deleteFcmToken = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        fcm_token: null,
      },
    });
    return res
      .status(200)
      .send(getSuccessData("Fcm token deleted successfully."));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

module.exports = router;
