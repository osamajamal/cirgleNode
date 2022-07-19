const router = require("express").Router();
const Prisma_Client = require("../../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
  approveUser,
  disapproveUser,
  blockReportedUser,
  updatePlanValidation,
  membershipPlansValidation,
  deletePlanValidation,
} = require("../../joiValidation/validate");
const { getUserFromId } = require("../../database_queries/auth");
const { getError, getSuccessData } = require("../../helper_functions/helpers");
const { AdminApproval, AccountTypes } = require("@prisma/client");
const { deleteFile } = require("../../s3_bucket/s3_bucket");
const { sendBlockStatusByAdmin } = require("../../socket/socket");

router.get("/getAllRegisteredUsers", trimRequest.all, async (req, res) => {
  const getAllRegisteredUsers = await prisma.users.findMany({
    where: {
      is_registered: true,
    },
    select: {
      user_id: true,
      user_email: true,
      fname: true,
      lname: true,
      account_types: true,
      accounts_created_on_ref: true,
      created_at: true,
      gender: true,
      profile_picture: true,
      admin_approval: true,
      user_report_me: true,
      user_pictures: true,
      bio: true,
      country: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  const maleUsers = getAllRegisteredUsers.filter(
    (user) => user.gender == "male"
  );
  const femaleUsers = getAllRegisteredUsers.filter(
    (user) => user.gender == "female"
  );
  const blockedUsers = getAllRegisteredUsers.filter(
    (user) => user.admin_approval == AdminApproval.BLOCKED
  );
  const reportedUsers = getAllRegisteredUsers.filter(
    (user) => user.user_report_me.length
  );
  const pendingUsers = getAllRegisteredUsers.filter(
    (user) => user.admin_approval == AdminApproval.PENDING
  );
  const paidUsers = getAllRegisteredUsers.filter(
    (user) => user.account_types !== "free"
  );
  return res.status(200).send(
    getSuccessData({
      Total_Users: getAllRegisteredUsers.length,
      Male_Users: maleUsers.length,
      Female_Users: femaleUsers.length,
      Blocked_Users: blockedUsers.length,
      Pending_Users: pendingUsers.length,
      Reported_Users: reportedUsers.length,
      Paid_Users: paidUsers.length,
      getAllRegisteredUsers,
    })
  );
});

router.get("/getAllFemaleUsers", trimRequest.all, async (req, res) => {
  try {
    const gender = "female";
    const getFemales = await prisma.users.findMany({
      where: {
        gender,
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        gender: true,
        profile_picture: true,
        admin_approval: true,
        user_report_me: true,
        user_pictures: true,
        bio: true,
        country: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.status(200).send(getSuccessData(getFemales));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getAllMaleUsers", trimRequest.all, async (req, res) => {
  try {
    const gender = "male";
    const getAllMales = await prisma.users.findMany({
      where: {
        gender,
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        gender: true,
        profile_picture: true,
        admin_approval: true,
        user_report_me: true,
        user_pictures: true,
        bio: true,
        country: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.status(200).send(getSuccessData(getAllMales));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getPaidUsers", trimRequest.all, async (req, res) => {
  try {
    const getPaidUsers = await prisma.users.findMany({
      where: {
        NOT: [
          {
            account_types: "free",
          },
        ],
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        gender: true,
        profile_picture: true,
        admin_approval: true,
        user_pictures: true,
        membership_created_at: true,
        membership_valid_for: true,
        bio: true,
        country: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.status(200).send(getSuccessData(getPaidUsers));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/createNewPlans", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = membershipPlansValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const {
      plan_name,
      plan_price,
      short_description,
      plan_detail,
      plan_duration,
    } = value;
    const existsPlanName = await prisma.membershipPlans.findFirst({
      where: {
        plan_name,
      },
    });
    if (existsPlanName) {
      return res.status(404).send(getError("Plan Already Exists!"));
    }
    const createPlans = await prisma.membershipPlans.create({
      data: {
        plan_name,
        plan_detail,
        plan_price,
        short_description,
        plan_duration,
      },
    });
    return res.status(200).send(getSuccessData("Successfully Created"));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getAllPlans", trimRequest.all, async (req, res) => {
  try {
    const getAllPlans = await prisma.membershipPlans.findMany({
      select: {
        plan_id: true,
        plan_name: true,
        short_description: true,
        plan_detail: true,
        plan_duration: true,
        plan_price: true,
        created_at: true,
      },
      orderBy: {
        plan_price: "asc",
      },
    });
    if (!getAllPlans) {
      return res.status(404).send(getError("No Record Available!"));
    }
    return res.status(200).send(getSuccessData(getAllPlans));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/updatePlans", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = updatePlanValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const {
      plan_id,
      plan_price,
      plan_detail,
      short_description,
      plan_duration,
      plan_name,
    } = value;
    const chkPlan = await prisma.membershipPlans.findFirst({
      where: {
        plan_id,
      },
    });
    if (!chkPlan) {
      return res.status(404).send(getError("Plan not found!"));
    }
    const updatePlan = await prisma.membershipPlans.update({
      where: {
        plan_id,
      },
      data: {
        plan_name,
        plan_price,
        plan_detail,
        short_description,
        plan_duration,
      },
    });
    return res.status(200).send(getSuccessData("Updated Successful."));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/deletePlans", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = deletePlanValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { plan_id } = value;
    const existingPlan = await prisma.membershipPlans.findFirst({
      where: {
        plan_id,
      },
    });
    if (!existingPlan) {
      return res.status(404).send(getError("Plan does not exist"));
    }
    await prisma.membershipPlans.delete({
      where: {
        plan_id,
      },
    });
    return res.status(200).send(getSuccessData("Plan deleted successfull"));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getBlockedUsers", trimRequest.all, async (req, res) => {
  try {
    const getBlocked = await prisma.users.findMany({
      where: {
        admin_approval: AdminApproval.BLOCKED,
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        gender: true,
        profile_picture: true,
        admin_approval: true,
        user_report_me: true,
        user_pictures: true,
        bio: true,
        country: true,
      },
    });
    return res.status(200).send(getSuccessData(getBlocked));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/fetchAllApprovedUsers", trimRequest.all, async (req, res) => {
  try {
    const getAllApprovedUsers = await prisma.users.findMany({
      where: {
        OR: [
          {
            admin_approval: AdminApproval.APPROVED,
          },
          {
            admin_approval: AdminApproval.BLOCKED,
          },
        ],
        is_registered: true,
      },
      select: {
        user_id: true,
        user_email: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        updated_at: true,
        gender: true,
        profile_picture: true,
        admin_approval: true,
        user_pictures: {
          select: {
            gallery_id: true,
            picture_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).send({
      getAllApprovedUsers,
    });
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getPendingUsers", trimRequest.all, async (req, res) => {
  try {
    const getPendingUsers = await prisma.users.findMany({
      where: {
        admin_approval: AdminApproval.PENDING,
        is_registered: true,
      },
      select: {
        user_id: true,
        fname: true,
        lname: true,
        account_types: true,
        accounts_created_on_ref: true,
        created_at: true,
        updated_at: true,
        gender: true,
        admin_approval: true,
        user_email: true,
        profile_picture: true,
        user_pictures: {
          select: {
            gallery_id: true,
            picture_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.status(200).send(getSuccessData(getPendingUsers));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.get("/getReportedUsers", trimRequest.all, async (req, res) => {
  try {
    let reportedUsers = [];
    const getAllUsers = await prisma.reports.findMany({
      select: {
        // reason: true,
        reported: {
          select: {
            user_id: true,
            user_email: true,
            fname: true,
            lname: true,
            account_types: true,
            accounts_created_on_ref: true,
            created_at: true,
            gender: true,
            profile_picture: true,
            admin_approval: true,
            user_report_me: {
              select: {
                reason: true,
                created_at: true,
                reporter: {
                  select: {
                    user_id: true,
                    user_email: true,
                    fname: true,
                    lname: true,
                    account_types: true,
                    accounts_created_on_ref: true,
                    created_at: true,
                    gender: true,
                    profile_picture: true,
                    admin_approval: true,
                    user_pictures: true,
                    bio: true,
                    country: true,
                  },
                },
              },
            },
            user_pictures: true,
            bio: true,
            country: true,
          },
        },
        // reporter: {
        //   select: {
        //     user_id: true,
        //     user_email: true,
        //     fname: true,
        //     lname: true,
        //     account_types: true,
        //     accounts_created_on_ref: true,
        //     created_at: true,
        //     gender: true,
        //     profile_picture: true,
        //     admin_approval: true,
        //     user_report_me: true,
        //     user_pictures: true,
        //     bio: true,
        //     country: true,
        //   },
        // },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    for (let i = 0; i < getAllUsers?.length; i++) {
      reportedUsers?.push(getAllUsers[i]?.reported);
    }
    const unique = Array.from(
      reportedUsers
        .reduce((map, obj) => map.set(obj.user_id, obj), new Map())
        .values()
    );

    return res.status(200).send(getSuccessData(unique));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/approveUsers", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = approveUser(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { user_id } = value;
    const getUser = await getUserFromId(user_id);
    if (!getUser) {
      return res.status(404).send(getError("User not found!"));
    }
    const makeUserApproved = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        admin_approval: AdminApproval.APPROVED,
      },
    });
    return res.status(200).send(getSuccessData("Successfully Approved"));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/disapproveUser", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = disapproveUser(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { user_id } = value;
    const findUser = await getUserFromId(user_id);
    if (!findUser) {
      return res.status(404).send(getError("User not found!"));
    }
    const chkUserGallery = await prisma.user_gallery.findMany({
      where: {
        user_id,
      },
    });
    if (chkUserGallery) {
      for await (const gallery of chkUserGallery) {
        await deleteFile(gallery.picture_url);
      }
      const delgallery = await prisma.user_gallery.deleteMany({
        where: {
          user_id,
        },
      });
    }
    const delUser = await prisma.users.delete({
      where: {
        user_id,
      },
    });
    return res.status(200).send(getSuccessData("User rejected successfully."));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/blockReportedUser", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = blockReportedUser(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { user_id } = value;
    const findUser = await getUserFromId(user_id);
    if (!findUser) {
      return res.status(404).send(getError("User not found"));
    }
    const blockUser = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        admin_approval: AdminApproval.BLOCKED,
      },
    });
    sendBlockStatusByAdmin(user_id, AdminApproval.BLOCKED);
    return res.status(200).send(getSuccessData("Successfully Blocked"));
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

module.exports = router;
