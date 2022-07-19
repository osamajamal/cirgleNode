const { MessageType} = require("@prisma/client");
const joi = require("joi");

function sendOtpWithEmail(data) {
  const sendOtpSchema = joi.object({
    email: joi.string().required().email(),
  });
  return sendOtpSchema.validate(data);
};

function checkEmailValidation(data) {
  const emailSchema = joi.object({
    email: joi.string().required().email(),
  });
  return emailSchema.validate(data);
};

function otpVerification(data) {
  const verifyOtpSchema = joi.object({
    email: joi
      .string()
      .required()
      .email(),
    otp: joi
      .number()
      .integer()
      .greater(1111)
      .less(9999)
      .required()
      .messages({
        "number.greater": "otp must be 4 digit number.",
        "number.less": "otp must be 4 digit number.",
      }),
  });
  return verifyOtpSchema.validate(data);
};

function socialSignupValidation(data) {
  const socialSignupSchema = joi.object({
    fname: joi.string().required(),
    lname: joi.string().required(),
    email: joi.string().required().email(),
    birthday: joi.number().min(18).required(),
    gender: joi.string().required(),
    height: joi.number().required(),
    religion: joi.string().required(),
    interested_in: joi.string().required(),
    country: joi.string().required(),
    nationality: joi.string().required(),
    longitude: joi.number().required(),
    latitude: joi.number().required(),
    user_passions: joi.array(),
    social_auth_id: joi.string().required(),
    refrer_id: joi.string(),
    fcm_token: joi.string().required(),
    bio: joi.string().required(),
  });
  return socialSignupSchema.validate(data);
};

function signUpValidation(data) {
  const signUpSchema = joi.object({
    fname: joi.string().required(),
    lname: joi.string().required(),
    user_email  : joi.string().required().email(),
    user_password : joi.string().required(),
    gender: joi.string().required(),
    phoneNo : joi.string().required(),
    location  :joi.string().required(),
  
  });
  return signUpSchema.validate(data);
};

function simpleLoginValidation(data) {
  const simpleLoginSchema = joi.object({
    phoneNo: joi.string().required(),
    user_password: joi.string().required(),
   
  });
  return simpleLoginSchema.validate(data);
};

function socialLoginValidation(data) {
  const socialLoginSchema = joi.object({
    email: joi.string().required().email(),
    social_auth_id: joi.string().required(),
    fcm_token: joi.string().required(),
  });
  return socialLoginSchema.validate(data);
};

function sendOtpForgotPassword(data) {
  const OtpForgotPasswordScema = joi.object({
    email: joi.string().required(),
  });
  return OtpForgotPasswordScema.validate(data);
};

function verifyOtpForgotPassValidation(data) {
  const verifyOtpForgotPassSchema = joi.object({
    email: joi.string().required().email(),
    otp: joi
    .number()
    .integer()
    .greater(1111)
    .less(9999)
    .required()
    .messages({
      "number.greater": "otp must be 4 digit number.",
      "number.less": "otp must be 4 digit number.",
    }),
  });
  return verifyOtpForgotPassSchema.validate(data);
};

function updateForgotPasswordValidation(data) {
  const updatePasswordSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
  });
  return updatePasswordSchema.validate(data);
};

function updateUserPasswordValidation(data) {
  const updatePasswordSchema = joi.object({
    old_password: joi.string().required(),
    new_password: joi.string().required(),
  });
  return updatePasswordSchema.validate(data);
};

function seenMessagesValidation(data) {
  const seenMessagesSchema = joi.object({
      sender_id: joi.string().required(),
  });
  return seenMessagesSchema.validate(data);
};

function messageValidation(data) {
  const messageSchema = joi.object({
    reciever_id: joi.string().required(),
    message_type: joi.string()
      .valid(MessageType.TEXT.toString(), MessageType.MEDIA.toString())
      .required(),
      attachment: joi.when("message_type", {
      is: MessageType.MEDIA.toString(),
      then: joi.string(),
    }),
    // media_type: joi.when("message_type", {
    //   is: MessageType.MEDIA.toString(),
    //   then: joi.string().required(),
    // }),
    message_body: joi.when("message_type", {
      is: MessageType.TEXT.toString(),
      then: joi.string().required(),
      otherwise: joi.string(),
    }),
  });
  return messageSchema.validate(data);
};

function deleteChatValidation(data) {
  const deleteChatschema = joi.object({
    reciever_id: joi.string().required(),
  });
  return deleteChatschema.validate(data);
};

function updateProfile(data) {
  const updateSchema = joi.object({
    fname: joi.string(),
    lname: joi.string(),
    birthday: joi.number().min(18).max(48),
    gender: joi.string(),
    height: joi.number(),
    religion: joi.string(),
    education: joi.string(),
    bio: joi.string(),
    country: joi.string(),
    city: joi.string(),
    smoking: joi.string(),
    have_kids: joi.string(),
    interested_in: joi.string(),
    nationality: joi.string(),
    other_info: joi.string(),
    looking_for_something: joi.string(),
    // user_passions: joi.array().min(4).max(5),
  });
  return updateSchema.validate(data);
};

function likeUserProfileValidation(data) {
  const likeUserProfileSchema = joi.object({
    userId: joi.string().required(),
    // LikeType: joi.string()
    //   .valid(LikeTypes.SIMPLE_LIKE.toString(), LikeTypes.SUPER_LIKE.toString())
    //   .required(),
    likeType: joi.string().required(),
  });
  return likeUserProfileSchema.validate(data);
};

function disLikeUserProfileValidation(data) {
  const findUserIdSchema = joi.object({
    userId: joi.string().required(),
  });
  return findUserIdSchema.validate(data);
};

function getImageId(data) {
  const getImageId = joi.object({
    imageId: joi.string().required()
  });
  return getImageId.validate(data);
};

function fetchMessageValidation(data) {
  const fetchMessageSchema = joi.object({
    reciever_id: joi.string().required()
  });
  return fetchMessageSchema.validate(data);
};

function blockProfileValidation(data) {
  const registerSchema = joi.object({
      blocked_id: joi.string().required(),
  });
  return registerSchema.validate(data);
};

function filterValidation(data) {
  const filterSchema = joi.object({
    interested_in: joi.string(),
    start_age: joi.number().min(18).max(48),
    end_age: joi.number().max(48),
    childern: joi.string(),
    other_filter: joi.string(),
    other_info: joi.string(),
    looking_for_something: joi.string(),
  });
  return filterSchema.validate(data);
};

function getUserProfile(data) {
  const userProfileSchema = joi.object({
    userId: joi.string().required(),
  });
  return userProfileSchema.validate(data);
};

function reportValidation(data) {
  const reportSchema = joi.object({
    reported_id: joi.string().required(),
    reason: joi.string().required(),
  });
  return reportSchema.validate(data);
};

function adminLoginValidation(data) {
  const adminLoginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });
  return adminLoginSchema.validate(data);
};

function approveUser(data) {
  const approveUserSchema = joi.object({
    user_id: joi.string().required(),
  });
  return approveUserSchema.validate(data);
};

function disapproveUser(data) {
  const disapproveSchema = joi.object({
    user_id: joi.string().required(),
  });
  return disapproveSchema.validate(data);
};

function blockReportedUser(data) {
  const blockReportedSchema = joi.object({
    user_id: joi.string().required(),
  });
  return blockReportedSchema.validate(data);
};

function purchaseValidation(data) {
  const today = new Date();
  const purchaseSchema = joi.object({
    card_number: joi.string().required(),
    exp_month: joi.when("card_number", {
      is: joi.exist(),
      then:
        data?.exp_year == today.getFullYear()
          ? joi.number().integer().min(today.getMonth()).max(12).required()
          : joi.number().integer().required(),
      otherwise: joi.any(),
    }),
    exp_year: joi.when("card_number", {
      is: joi.exist(),
      then: joi.number().integer().min(today.getFullYear()).required(),
      otherwise: joi.any(),
    }),
    cvc_number: joi.when("card_number", {
      is: joi.exist(),
      then: joi.string().required(),
      otherwise: joi.any(),
    }),
    plan_id: joi.string().required(),
  });
  return purchaseSchema.validate(data);
};

function membershipPlansValidation(data) {
  const createPlanSchema = joi.object({
    plan_name: joi.string().required(),
    short_description: joi.string().required(),
    plan_detail: joi.string().required(),
    plan_duration: joi.number().required().min(1),
    plan_price: joi.number().required().min(1),
  });
  return createPlanSchema.validate(data);
}

function updatePlanValidation(data) {
  const updatePlanValidationSchema = joi.object({
    plan_id: joi.string().required(),
    plan_name: joi.string(),
    plan_price: joi.number().min(1),
    plan_detail: joi.string(),
    short_description: joi.string(),
    plan_duration: joi.number().min(1),
  });
  return updatePlanValidationSchema.validate(data);
};

function deletePlanValidation(data) {
  const planSchema = joi.object({
    plan_id: joi.string().required(),
  });
  return planSchema.validate(data);
}

function fcmTokenValidation(data) {
  const fcmSchema = joi.object({
    fcm_token: joi.string().required(),
  });
  return fcmSchema.validate(data);
}

function referalIdValidation(data) {
  const referIdSchema = joi.object({
    refrer_id: joi.string(),
  });
  return referIdSchema.validate(data);
};

module.exports = {
  sendOtpWithEmail,
  fcmTokenValidation,
  checkEmailValidation,
  otpVerification,
  signUpValidation,
  socialSignupValidation,
  updateProfile,
  likeUserProfileValidation,
  disLikeUserProfileValidation,
  getImageId,
  simpleLoginValidation,
  socialLoginValidation,
  sendOtpForgotPassword,
  blockProfileValidation,
  verifyOtpForgotPassValidation,
  updateForgotPasswordValidation,
  updateUserPasswordValidation,
  filterValidation,
  messageValidation,
  fetchMessageValidation,
  getUserProfile,
  seenMessagesValidation,
  deleteChatValidation,
  reportValidation,
  adminLoginValidation,
  approveUser,
  disapproveUser,
  blockReportedUser,
  purchaseValidation,
  updatePlanValidation,
  referalIdValidation,
  membershipPlansValidation,
  deletePlanValidation,
};
