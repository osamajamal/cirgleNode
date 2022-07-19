const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
var _ = require("lodash");
const fs = require("fs");
const {
  getError,
  getSuccessData,
  deleteUploadedImage,
} = require("../helper_functions/helpers");
const {
  messageValidation,
  fetchMessageValidation,
  seenMessagesValidation,
  deleteChatValidation,
} = require("../joiValidation/validate");
const { getUserFromId } = require("../database_queries/auth");
const trimRequest = require("trim-request");
const { MessageType } = require("@prisma/client");
const {
  chkMessageChannel,
  createMessageChannel,
} = require("../database_queries/chat");
const uploadMedia = require("../middlewares/sendMedia");
const {
  sendTextMessage,
  sendMediaMessage,
  seenMessages,
  sendNotificationCounter,
} = require("../socket/socket");
const { uploadFile, deleteFile } = require("../s3_bucket/s3_bucket");
const { SendNotification } = require("../Notification/pushNotification");

router.post(
  "/sendMessages",
  [uploadMedia, trimRequest.all],
  async (req, res) => {
    try {
      let sender_id = req.user.user_id;
      const { fname, lname, profile_picture } = req.user;
      let files = [];
      let media = [];
      const { error, value } = messageValidation(req.body);
      if (error) {
        return res.status(404).send(getError(error.details[0].message));
      }
      if (req.file_error) {
        deleteUploadedImage(req);
        return res.status(404).send(getError(req.file_error));
      }
      let { reciever_id, message_body, message_type } = value;

      const isBlock = await prisma.blockProfile.findFirst({
        where: {
          blocker_id: sender_id,
          blocked_id: reciever_id,
        },
      });

      const isBlockMe = await prisma.blockProfile.findFirst({
        where: {
          blocker_id: reciever_id,
          blocked_id: sender_id,
        },
      });

      if (isBlock) {
        return res
          .status(404)
          .send(
            getError(
              "You block this user! Please unblock first then you can send the message."
            )
          );
      }
      if (isBlockMe) {
        return res
          .status(404)
          .send(
            getError(
              "You blocked from this user! You can not send the message."
            )
          );
      }
      const chkSender = await getUserFromId(sender_id);
      if (!chkSender) {
        return res.status(404).send(getError("Unauthorized user!"));
      }
      const chkReciever = await getUserFromId(reciever_id);
      if (!chkReciever) {
        return res
          .status(404)
          .send(getError("Reciever is not available in our record."));
      }
      if (reciever_id == sender_id) {
        return res
          .status(404)
          .send(getError("Message does not send to your self"));
      }
      let chkChannel = await chkMessageChannel(sender_id, reciever_id);
      if (!chkChannel) {
        chkChannel = await createMessageChannel(sender_id, reciever_id);
      }

      // if (req.files) {
      //     req.files.forEach((file) => {
      //         const fileName = file ? file.filename : null;
      //         if (fileName) {
      //             files.push({
      //                 attatchment: fileName,
      //                 sender_id,
      //                 reciever_id,
      //                 msg_channel_id: chkChannel ? chkChannel.channel_id : chkChannel.channel_id,
      //                 message_type,
      //             });
      //             media.push({
      //                 attatchment: fileName,
      //             });
      //         }
      //     });
      // }

      // s3 bucket for media
      if (req.files) {
        for (const file of req.files) {
          if (file) {
            let { Location } = await uploadFile(file);
            files.push({
              attatchment: Location,
              sender_id,
              reciever_id,
              msg_channel_id: chkChannel
                ? chkChannel.channel_id
                : chkChannel.channel_id,
              message_type,
            });
            media.push({
              attatchment: Location,
            });
          }
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
      if (message_type === MessageType.MEDIA && files.length >= 0) {
        const createMedia = await prisma.messages.createMany({
          data: files,
        });
        sendMediaMessage(sender_id, reciever_id, media, message_type);
        // Notifications
        const isNotificationAllowed = await prisma.users.findFirst({
          where: {
            user_id: reciever_id,
            notifications: true,
          },
        });
        if (isNotificationAllowed) {
          const getFcmToken = await prisma.users.findFirst({
            where: {
              user_id: reciever_id,
            },
            select: {
              fcm_token: true,
            },
          });
          if (getFcmToken?.fcm_token) {
            SendNotification(getFcmToken.fcm_token, {
              // profile: profile_picture,
              title: fname + "" + lname,
              body: "Send you a attachment",
            })
              .then((res) => {
                console.log(res, "done");
              })
              .catch((error) => {
                console.log(error, "Error sending notification");
              });
          }
        }
        sendNotificationCounter(sender_id, reciever_id, true);
        return res.status(200).send(getSuccessData(createMedia));
      }
      if (message_type === MessageType.TEXT) {
        files = null;
        deleteUploadedImage(req);
        const createMessage = await prisma.messages.create({
          data: {
            sender_id,
            reciever_id,
            msg_channel_id: chkChannel
              ? chkChannel.channel_id
              : chkChannel.channel_id,
            message_body,
            message_type,
          },
        });
        sendTextMessage(sender_id, reciever_id, message_body, message_type);
        // Notifications
        const isNotificationAllowed = await prisma.users.findFirst({
          where: {
            user_id: reciever_id,
            notifications: true,
          },
        });
        if (isNotificationAllowed) {
          const getFcmToken = await prisma.users.findFirst({
            where: {
              user_id: reciever_id,
            },
            select: {
              fcm_token: true,
            },
          });
          if (getFcmToken?.fcm_token) {
            SendNotification(getFcmToken.fcm_token, {
              // profile: profile_picture,
              title: fname + "" + lname,
              body: "Send you a message",
            })
              .then((res) => {
                console.log(res, "done");
              })
              .catch((error) => {
                console.log(error, "Error sending notification");
              });
          }
        }
        sendNotificationCounter(sender_id, reciever_id, true);
        return res.status(200).send(getSuccessData(createMessage));
      }
    } catch (catchError) {
      if (catchError && catchError.message) {
        return res.status(404).send(getError(catchError.message));
      }
      return res.status(404).send(getError(catchError));
    }
  }
);

router.post("/fetch_messages", trimRequest.all, async (req, res) => {
  try {
    const sender_id = req.user.user_id;
    const { error, value } = fetchMessageValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { reciever_id } = value;
    const getChannel = await prisma.messages_Channel.findFirst({
      where: {
        OR: [
          {
            sender_id,
            reciever_id,
          },
          {
            sender_id: reciever_id,
            reciever_id: sender_id,
          },
        ],
      },
    });
    if (!getChannel) {
      return res.status(404).send(getError("No channel Exist"));
    }
    const getMessage = await prisma.messages_Channel.findFirst({
      where: {
        channel_id: getChannel.channel_id,
      },
      select: {
        channel_messages: true,
      },
    });

    const get = getMessage.channel_messages;
    const msgs = _.orderBy(get, ["created_at"], ["asc"]);
    return res.status(200).send(getSuccessData(msgs));
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(404).send(getError(catchError.message));
    }
    return res.status(404).send(getError(catchError));
  }
});

router.get("/get_message_contacts", trimRequest.all, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const contacts = await prisma.users.findFirst({
      where: {
        user_id,
      },
      select: {
        primary_user_channel: {
          select: {
            reciever: {
              select: {
                user_id: true,
                fname: true,
                profile_picture: true,
                online_status: true,
                online_status_time: true,
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
                send_messages: {
                  where: {
                    OR: [
                      {
                        sender_id: user_id,
                      },
                      {
                        reciever_id: user_id,
                      },
                    ],
                  },
                },
                recieve_messages: {
                  where: {
                    OR: [
                      {
                        reciever_id: user_id,
                      },
                      {
                        sender_id: user_id,
                      },
                    ],
                  },
                },
              },
            },
            channel_messages: {
              orderBy: {
                created_at: "desc",
              },
            },
          },
        },
        secondary_user_channel: {
          select: {
            sender: {
              select: {
                user_id: true,
                fname: true,
                profile_picture: true,
                online_status: true,
                online_status_time: true,
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
                send_messages: {
                  where: {
                    OR: [
                      {
                        reciever_id: user_id,
                      },
                      {
                        sender_id: user_id,
                      },
                    ],
                  },
                },
                recieve_messages: {
                  where: {
                    OR: [
                      {
                        sender_id: user_id,
                      },
                      {
                        reciever_id: user_id,
                      },
                    ],
                  },
                },
              },
            },
            channel_messages: {
              orderBy: {
                created_at: "desc",
              },
            },
          },
        },
      },
    });

    const first = contacts.primary_user_channel;
    const send = first.map((arr) => {
      if (arr.reciever.user_i_block.length > 0) {
        arr.reciever.is_user_i_block = true;
      } else {
        arr.reciever.is_user_i_block = false;
      }
      if (arr.reciever.user_blocked_me.length > 0) {
        arr.reciever.is_user_block_me = true;
      } else {
        arr.reciever.is_user_block_me = false;
      }
      delete arr.reciever.user_i_block;
      delete arr.reciever.user_blocked_me;

      if (
        arr.reciever.send_messages.length > 0 &&
        arr.reciever.recieve_messages.length > 0
      ) {
        arr.reciever.is_chat_start = true;
      } else {
        arr.reciever.is_chat_start = false;
      }
      delete arr.reciever.send_messages;
      delete arr.reciever.recieve_messages;

      const obj = arr.reciever;
      obj.last_message =
        arr.channel_messages.length > 0
          ? arr.channel_messages[0].message_body
            ? arr.channel_messages[0].message_body
            : arr.channel_messages[0].attatchment
          : null;
      obj.last_message_time =
        arr.channel_messages.length > 0
          ? arr.channel_messages[0].created_at
          : null;
      obj.un_seen_counter = arr.channel_messages.filter(
        (ar) => ar.seen == false && ar.reciever_id == user_id
      ).length;

      return obj;
    });

    const second = contacts.secondary_user_channel;
    const recieve = second.map((ary) => {
      if (ary.sender.user_i_block.length > 0) {
        ary.sender.is_user_i_block = true;
      } else {
        ary.sender.is_user_i_block = false;
      }
      if (ary.sender.user_blocked_me.length > 0) {
        ary.sender.is_user_block_me = true;
      } else {
        ary.sender.is_user_block_me = false;
      }
      delete ary.sender.user_blocked_me;
      delete ary.sender.user_i_block;

      const obj = ary.sender;
      if (obj.send_messages.length > 0 && obj.recieve_messages.length > 0) {
        obj.is_chat_start = true;
      } else {
        obj.is_chat_start = false;
      }
      delete obj.send_messages;
      delete obj.recieve_messages;

      obj.last_message =
        ary.channel_messages.length > 0
          ? ary.channel_messages[0].message_body
            ? ary.channel_messages[0].message_body
            : ary.channel_messages[0].attatchment
          : null;
      obj.last_message_time =
        ary.channel_messages.length > 0
          ? ary.channel_messages[0].created_at
          : null;
      obj.un_seen_counter = ary.channel_messages.filter(
        (ar) => ar.seen == false && ar.reciever_id == user_id
      ).length;
      return obj;
    });

    const friend = [...send, ...recieve];
    const sorted = _.orderBy(friend, ["last_message_time"], ["desc"]);
    return res.status(200).send(getSuccessData(sorted));
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(404).send(getError(catchError.message));
    }
    return res.status(404).send(getError(catchError));
  }
});

router.post("/seen_messages", trimRequest.all, async (req, res) => {
  // console.log("Iam seen body:::",req.body.sender_id);
  try {
    const { error, value } = seenMessagesValidation(req.body);
    if (error) {
      return res.status(400).send(getError(error.details[0].message));
    }
    const reciever_id = req.user.user_id;
    const { sender_id } = value;
    const findSender = await getUserFromId(sender_id);
    if (!findSender) {
      return res.status(404).send(getError("User not found!"));
    }
    if (sender_id == reciever_id) {
      return res
        .status(404)
        .send(getError("sender id should be different from reciever id."));
    }
    const message_id = await prisma.messages.findMany({
      where: {
        sender_id,
        reciever_id,
        seen: false,
      },
      select: {
        message_id: true,
      },
    });
    const is_seen = await prisma.messages.updateMany({
      where: {
        sender_id,
        reciever_id,
      },
      data: {
        seen: true,
      },
    });
    if (is_seen.count <= 0) {
      return res.status(400).send(getError("No data found"));
    }
    seenMessages(reciever_id, sender_id, message_id, true);
    return res.status(200).send(getSuccessData("Successfully done"));
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(400).send(getError(catchError.message));
    }
    return res.status(400).send(getError(catchError));
  }
});

router.post("/delete_chat", trimRequest.all, async (req, res) => {
  try {
    const sender_id = req.user.user_id;
    const { error, value } = deleteChatValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { reciever_id } = value;
    const findSender = await getUserFromId(sender_id);
    if (!findSender) {
      return res.status(404).send(getError("User not found!"));
    }
    const findReciever = await getUserFromId(reciever_id);
    if (!findReciever) {
      return res.status(404).send(getError("User not found!"));
    }
    if (sender_id == reciever_id) {
      return res
        .status(404)
        .send(getError("Action cannot perform on same id."));
    }
    const getChannel = await prisma.messages_Channel.findFirst({
      where: {
        OR: [
          {
            sender_id,
            reciever_id,
          },
          {
            sender_id: reciever_id,
            reciever_id: sender_id,
          },
        ],
      },
    });
    if (!getChannel) {
      return res.status(404).send(getError("No channel exist!"));
    }
    const messages = await prisma.messages.findMany({
      where: {
        msg_channel_id: getChannel.channel_id,
        message_type: MessageType.MEDIA,
      },
    });
    for await (const media of messages) {
      await deleteFile(media.attatchment);
    }
    const deleteMessages = await prisma.messages.deleteMany({
      where: {
        msg_channel_id: getChannel.channel_id,
      },
    });
    const delMsgChannel = await prisma.messages_Channel.delete({
      where: {
        channel_id: getChannel.channel_id,
      },
    });
    return res.status(200).send(getSuccessData("Chat deleted Successfully."));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

module.exports = router;
