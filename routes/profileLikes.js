const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
var _ = require("lodash");
const {
  disLikeUserProfileValidation,
  likeUserProfileValidation,
} = require("../joiValidation/validate");
const { getUserFromId } = require("../database_queries/auth");
const { getError, getSuccessData } = require("../helper_functions/helpers");
const {
  LikeTypes,
  AccountTypes,
  NotificationType,
  AdminApproval,
} = require("@prisma/client");
const { SendNotification } = require("../Notification/pushNotification");
const { sendNotificationCounter } = require("../socket/socket");

router.post("/like_user_profile", trimRequest.all, async (req, res) => {
  try {
    const from_id = req.user.user_id;
    const me = req.user;
    const { fname, lname, profile_picture } = req.user;
    const { error, value } = likeUserProfileValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { userId, likeType } = value;
    if (userId == from_id) {
      return res.status(404).send(getError("Action not perform on same ID"));
    }
    const findUser = await getUserFromId(userId);
    if (!findUser) return res.status(404).send(getError("User Not Found!"));
    const iBlock = await prisma.blockProfile.findFirst({
      where: {
        blocker_id: from_id,
        blocked_id: userId,
      },
    });
    if (iBlock) {
      return res
        .status(404)
        .send(getError("You blocked this user unblock to continue."));
    }
    const blockMe = await prisma.blockProfile.findFirst({
      where: {
        blocker_id: userId,
        blocked_id: from_id,
      },
    });
    if (blockMe) {
      return res.status(404).send(getError("You are blocked by this user."));
    }
    // Simple Like
    if (likeType == "SIMPLE_LIKE") {
      const chkExistingLike = await prisma.user_Likes.findFirst({
        where: {
          from_id,
          to_id: userId,
        },
      });
      if (chkExistingLike) {
        await prisma.user_Likes.delete({
          where: {
            User_Likes_id: chkExistingLike.User_Likes_id,
          },
        });
        const findNotification = await prisma.notifications.findFirst({
          where: {
            to_id: userId,
            notification_type: NotificationType.LIKE,
          },
        });
        await prisma.notifications.delete({
          where: {
            notifications_id: findNotification.notifications_id,
          },
        });
        return res
          .status(200)
          .send(getSuccessData("You successfully unlike this user."));
      }
      const User_Likes = await prisma.user_Likes.create({
        data: {
          from_id,
          to_id: userId,
        },
      });
      if (User_Likes) {
        // Notifications
        const isNotificationAllowed = await prisma.users.findFirst({
          where: {
            user_id: userId,
            notifications: true,
          },
        });
        if (isNotificationAllowed) {
          const getFcmToken = await prisma.users.findFirst({
            where: {
              user_id: userId,
            },
            select: {
              fcm_token: true,
            },
          });
          if (getFcmToken?.fcm_token) {
            SendNotification(getFcmToken.fcm_token, {
              // profile: profile_picture,
              title: fname + "" + lname,
              body: "Likes Your Profile.",
            })
              .then((res) => {
                console.log(res, "done");
              })
              .catch((error) => {
                console.log(error, "Error sending notification");
              });
          }
          sendNotificationCounter(from_id, userId, true);
          await prisma.notifications.create({
            data: {
              from_id,
              to_id: userId,
              notification_type: NotificationType.LIKE,
            },
          });
        }
        // END
        return res
          .status(200)
          .send(getSuccessData("You successfully like this user."));
      }
    }
    // END
    // Super Like
    if (likeType == "SUPER_LIKE") {
      if (me.account_types == "free") {
        return res
          .status(404)
          .send(
            getError("Please Purchase Membership First to Access Super Likes.")
          );
      }
      const chkExistingLike = await prisma.super_likes.findFirst({
        where: {
          from_id,
          to_id: userId,
        },
      });
      if (chkExistingLike) {
        await prisma.super_likes.delete({
          where: {
            Super_likes_id: chkExistingLike.Super_likes_id,
          },
        });
        const findNotification = await prisma.notifications.findFirst({
          where: {
            to_id: userId,
            notification_type: NotificationType.SUPER_LIKE,
          },
        });
        await prisma.notifications.delete({
          where: {
            notifications_id: findNotification.notifications_id,
          },
        });
        return res
          .status(200)
          .send(getSuccessData("You successfully unlike this user."));
      }
      const User_Super_Like = await prisma.super_likes.create({
        data: {
          from_id,
          to_id: userId,
        },
      });
      if (User_Super_Like) {
        // Notifications
        const isNotificationAllowed = await prisma.users.findFirst({
          where: {
            user_id: userId,
            notifications: true,
          },
        });
        if (isNotificationAllowed) {
          const getFcmToken = await prisma.users.findFirst({
            where: {
              user_id: userId,
            },
            select: {
              fcm_token: true,
            },
          });
          if (getFcmToken?.fcm_token) {
            SendNotification(getFcmToken.fcm_token, {
              // profile: profile_picture,
              title: fname + "" + lname,
              body: "Gives you a SUPER LIKE",
            })
              .then((res) => {
                console.log(res, "done");
              })
              .catch((error) => {
                console.log(error, "Error sending notification");
              });
          }
          sendNotificationCounter(from_id, userId, true);
          await prisma.notifications.create({
            data: {
              from_id,
              to_id: userId,
              notification_type: NotificationType.SUPER_LIKE,
            },
          });
        }
        // END
        return res
          .status(200)
          .send(getSuccessData("You successfully Super like this user."));
      }
    }
    // END
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err.message));
    }
    return res.status(404).send(getError(err));
  }
});

router.post("/dislike_user_profile", trimRequest.all, async (req, res) => {
  try {
    const from_id = req.user.user_id;
    const { error, value } = disLikeUserProfileValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { userId } = value;
    if (userId == from_id) {
      return res.status(404).send(getError("Action not perform on same ID"));
    }
    const findUser = getUserFromId(userId);
    if (!findUser) return res.status(404).send(getError("User Not Found!"));
    const chkExistingSimpleLike = await prisma.user_Likes.findFirst({
      where: {
        from_id,
        to_id: userId,
      },
    });
    if (chkExistingSimpleLike) {
      await prisma.user_Likes.delete({
        where: {
          User_Likes_id: chkExistingSimpleLike.User_Likes_id,
        },
      });
      const findNotification = await prisma.notifications.findFirst({
        where: {
          to_id: userId,
        },
      });
      await prisma.notifications.delete({
        where: {
          notifications_id: findNotification.notifications_id,
        },
      });
    }
    const chkExistingSuperLike = await prisma.super_likes.findFirst({
      where: {
        from_id,
        to_id: userId,
      },
    });
    if (chkExistingSuperLike) {
      await prisma.super_likes.delete({
        where: {
          Super_likes_id: chkExistingSuperLike.Super_likes_id,
        },
      });
      const findNotification = await prisma.notifications.findFirst({
        where: {
          to_id: userId,
        },
      });
      await prisma.notifications.delete({
        where: {
          notifications_id: findNotification.notifications_id,
        },
      });
    }
    return res
      .status(200)
      .send(getSuccessData("You successfully dislike this user."));
  } catch (err) {
    if (err & err.message) {
      return res.status(404).send(getError(err.message));
    }
    return res.status(404).send(getError(err));
  }
});

router.post("/see_who_liked_me", trimRequest.all, async (req, res) => {
  try {
    const { user_id } = req.user;
    const findUser = await getUserFromId(user_id);
    if (!findUser) {
      return res.status(404).send(getError("User not found!"));
    }

    const getLikes = await prisma.users.findFirst({
      where: {
        user_id,
        admin_approval: AdminApproval.APPROVED,
      },
      select: {
        // This is for checking whom i like or whom i block
        // likes: {
        //   select: {
        //     likers: {
        //       select: {
        //         user_id: true,
        //         fname: true,
        //         lname: true,
        //         profile_picture: true,
        //         likes: {
        //           where: {
        //             OR: [{
        //               to_id: user_id,
        //             },
        //               {
        //                 from_id: user_id,
        //               },
        //             ],
        //           },
        //         },
        //         likers: {
        //           where: {
        //             OR: [{
        //               to_id: user_id,
        //             },
        //               {
        //                 from_id: user_id,
        //               },
        //             ],
        //           },
        //         },
        //         user_i_block: {
        //           where: {
        //             OR: [{
        //               blocker_id: user_id,
        //             }, {
        //               blocked_id: user_id,
        //               },
        //             ],
        //           },
        //         },
        //         user_blocked_me: {
        //           where: {
        //             OR: [{
        //               blocked_id: user_id,
        //             }, {
        //               blocker_id: user_id,
        //             },
        //             ],
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
        likers: {
          select: {
            likes: {
              select: {
                user_id: true,
                fname: true,
                lname: true,
                profile_picture: true,
                likes: {
                  where: {
                    OR: [
                      {
                        to_id: user_id,
                      },
                      {
                        from_id: user_id,
                      },
                    ],
                  },
                },
                likers: {
                  where: {
                    OR: [
                      {
                        to_id: user_id,
                      },
                      {
                        from_id: user_id,
                      },
                    ],
                  },
                },
                user_i_block: {
                  where: {
                    OR: [
                      {
                        blocker_id: user_id,
                      },
                      {
                        blocked_id: user_id,
                      },
                    ],
                  },
                },
                user_blocked_me: {
                  where: {
                    OR: [
                      {
                        blocked_id: user_id,
                      },
                      {
                        blocker_id: user_id,
                      },
                    ],
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
        super_likes_on_me: {
          select: {
            i_super_likes: {
              select: {
                user_id: true,
                fname: true,
                lname: true,
                profile_picture: true,
                i_super_likes: {
                  where: {
                    OR: [
                      {
                        to_id: user_id,
                      },
                      {
                        from_id: user_id,
                      },
                    ],
                  },
                },
                super_likes_on_me: {
                  where: {
                    OR: [
                      {
                        to_id: user_id,
                      },
                      {
                        from_id: user_id,
                      },
                    ],
                  },
                },
                user_i_block: {
                  where: {
                    OR: [
                      {
                        blocker_id: user_id,
                      },
                      {
                        blocked_id: user_id,
                      },
                    ],
                  },
                },
                user_blocked_me: {
                  where: {
                    OR: [
                      {
                        blocked_id: user_id,
                      },
                      {
                        blocker_id: user_id,
                      },
                    ],
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    // This is for checking whom i like or whom i block
    // const first = getLikes.likes;
    // const send = first.map((arr) => {
    //   if (arr.likers.user_i_block > 0) {
    //     arr.likers.is_user_i_block = true;
    //     delete arr.likers.user_i_block;
    //   }
    //   else {
    //     arr.likers.is_user_i_block = false;
    //     delete arr.likers.user_i_block;
    //   }
    //   if (arr.likers.user_blocked_me > 0) {
    //     arr.likers.is_user_blocked_me = true;
    //     delete arr.likers.user_blocked_me;
    //   }
    //   else {
    //     arr.likers.is_user_blocked_me = false;
    //     delete arr.likers.user_blocked_me;
    //   }
    //   if (arr.likers.likes.length > 0 && arr.likers.likers.length > 0) {
    //     arr.likers.is_liked_both = true;
    //     delete arr.likers.likes;
    //     delete arr.likers.likers;
    //   }
    //   else {
    //     arr.likers.is_liked_both = false;
    //     delete arr.likers.likes;
    //     delete arr.likers.likers;
    //   }
    //   const obj = arr.likers;
    //   return obj;
    // });
    // For getting who likes me..
    const second = getLikes.likers;
    const recieve = second.map((arr) => {
      if (arr.likes.likes) {
        arr.likes.like_type = LikeTypes.SIMPLE_LIKE;
      }
      if (arr.likes.user_i_block > 0) {
        arr.likes.is_user_i_block = true;
        delete arr.likes.user_i_block;
      } else {
        arr.likes.is_user_i_block = false;
        delete arr.likes.user_i_block;
      }
      if (arr.likes.user_blocked_me > 0) {
        arr.likes.is_user_blocked_me = true;
        delete arr.likes.user_blocked_me;
      } else {
        arr.likes.is_user_blocked_me = false;
        delete arr.likes.user_blocked_me;
      }
      if (arr.likes.likes.length > 0 && arr.likes.likers.length > 0) {
        arr.likes.is_liked_both = true;
      } else {
        arr.likes.is_liked_both = false;
      }
      delete arr.likes.likes;
      delete arr.likes.likers;

      return arr.likes;
    });

    const third = getLikes.super_likes_on_me;
    const mylikes = third.map((arr) => {
      if (arr.i_super_likes.i_super_likes) {
        arr.i_super_likes.like_type = LikeTypes.SUPER_LIKE;
      }
      if (arr.i_super_likes.user_i_block > 0) {
        arr.i_super_likes.is_user_i_block = true;
        delete arr.i_super_likes.user_i_block;
      } else {
        arr.i_super_likes.is_user_i_block = false;
        delete arr.i_super_likes.user_i_block;
      }
      if (arr.i_super_likes.user_blocked_me > 0) {
        arr.i_super_likes.is_user_blocked_me = true;
        delete arr.i_super_likes.user_blocked_me;
      } else {
        arr.i_super_likes.is_user_blocked_me = false;
        delete arr.i_super_likes.user_blocked_me;
      }
      if (
        arr.i_super_likes.i_super_likes.length > 0 &&
        arr.i_super_likes.super_likes_on_me.length > 0
      ) {
        arr.i_super_likes.is_super_liked_both = true;
      } else {
        arr.i_super_likes.is_super_liked_both = false;
      }
      delete arr.i_super_likes.i_super_likes;
      delete arr.i_super_likes.super_likes_on_me;

      return arr.i_super_likes;
    });

    const friend = [...mylikes, ...recieve];
    const sorted = _.orderBy(friend, ["created_at"], ["desc"]);
    return res.status(200).send(getSuccessData(sorted));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

module.exports = router;
