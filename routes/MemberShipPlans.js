const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const {
  purchaseValidation,
  updatePlanValidation,
} = require("../joiValidation/validate");
const {
  getError,
  getSuccessData,
  createToken,
} = require("../helper_functions/helpers");
const { cardToken, chargeCard } = require("./_Stripe");
const { AccountTypes, MemberShipTypes } = require("@prisma/client");
const moment = require("moment");

router.get("/getAllPlans", trimRequest.all, async (req, res) => {
  try {
    const getAllPlans = await prisma.membershipPlans.findMany({
      select: {
        plan_id: true,
        plan_name: true,
        plan_price: true,
        short_description: true,
        plan_detail: true,
        plan_duration: true,
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
    const { plan_id, plan_price } = value;
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
        plan_price,
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

router.post("/purchasePlan", trimRequest.all, async (req, res) => {
  try {
    var date = new Date();
    const { error, value } = purchaseValidation(req.body);
    if (error) {
      return res.status(404).send(getError(error.details[0].message));
    }
    const { card_number, exp_month, exp_year, cvc_number, plan_id } = value;
    const { user_id, fname, lname } = req.user;
    const chkPlan = await prisma.membershipPlans.findUnique({
      where: {
        plan_id,
      },
    });
    if (!chkPlan) {
      return res.status(404).send(getError("Plan not found!"));
    }
    // if (chkPlan.plan_name == MemberShipTypes.SILVER) {
    const card_token = await cardToken({
      card_number,
      exp_month,
      exp_year,
      cvc_number,
    });
    await chargeCard({
      card_token: card_token?.id,
      amount: chkPlan?.plan_price * 100,
      description: `${fname} ${lname} Purchased ${chkPlan?.plan_name}`,
    });
    const validity = date.setMonth(date.getMonth() + chkPlan?.plan_duration);
    console.log("validity", moment(validity).format("Do MM YYYY"));
    const updateUser = await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        account_types: chkPlan?.plan_name,
        membership_created_at: new Date(),
        membership_valid_for: new Date(validity),
      },
    });
    return res.status(200).send(getSuccessData(await createToken(updateUser)));
    // } else if (chkPlan.plan_name == MemberShipTypes.GOLD) {
    //   const card_token = await cardToken({
    //     card_number,
    //     exp_month,
    //     exp_year,
    //     cvc_number,
    //   });
    //   await chargeCard({
    //     card_token: card_token.id,
    //     amount: chkPlan.plan_price * 100,
    //     description: `${fname} ${lname} Purchased ${chkPlan.plan_name}`,
    //   });

    //   const updateUser = await prisma.users.update({
    //     where: {
    //       user_id,
    //     },
    //     data: {
    //       account_types: AccountTypes.GOLD,
    //       membership_created_at: new Date(),
    //     },
    //   });
    //   return res.status(200).send(getSuccessData(await createToken(updateUser)));
    // } else if (chkPlan.plan_name == MemberShipTypes.DIAMOND) {
    //   const card_token = await cardToken({
    //     card_number,
    //     exp_month,
    //     exp_year,
    //     cvc_number,
    //   });
    //   await chargeCard({
    //     card_token: card_token.id,
    //     amount: chkPlan.plan_price * 100,
    //     description: `${fname} ${lname} Purchased ${chkPlan.plan_name}`,
    //   });

    //   const updateUser = await prisma.users.update({
    //     where: {
    //       user_id,
    //     },
    //     data: {
    //       account_types: AccountTypes.DIAMOND,
    //       membership_created_at: new Date(),
    //     },
    //   });
    //   return res.status(200).send(getSuccessData( await createToken(updateUser)));
    // } else {
    //   return res
    //     .status(200)
    //     .send(getError("You cannot purchase other than these plans!"));
    // }
  } catch (error) {
    if (error && error.message) {
      return res.status(404).send(getError(error.message));
    }
    return res.status(404).send(getError(error));
  }
});

router.post("/delallPlans", async (req, res) => {
  await prisma.membershipPlans.deleteMany();
});

module.exports = router;
