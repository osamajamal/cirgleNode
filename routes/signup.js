const router = require("express").Router();
const Prisma_Client = require("../prisma_client/_prisma");
const prisma = Prisma_Client.prismaClient;
const trimRequest = require("trim-request");
const profile = require('../middlewares/profileImgMulter')

const {
  signUpValidation,
  simpleLoginValidation,
  checkEmailValidation,
  referalIdValidation,
} = require("../joiValidation/validate");
const {
  getError,
  getSuccessData,
  createToken,
} = require("../helper_functions/helpers");
const { getUserFromEmail, getUserFromPhone } = require("../database_queries/auth");
const { AdminApproval, AccountTypes } = require("@prisma/client");

// SIMPLE SIGNUP USER
router.post("/signUpUser", [trimRequest.all , profile], async (req, res) => {
  // console.log("iam body:::", req.body);
  // return res.status(200).send(getSuccessData("done"));
  // console.log("iam profile:::", req.files?.["profile"]);
  // console.log("iam gallery images:::", req.files ?.["gallery"][0].path);
  console.log("file",req.file);
  try {
   
    const { error, value } = signUpValidation(req.body);
    if (error) {
      
      return res.status(404).send(getError(error.details[0].message));
    }
   
    // Variables
    const {
      fname: _fname,
      lname: _lname,
      user_email : _email,
      user_password,
      gender: _gender,
      phoneNo,
      location : _location,
      created_at,
      updated_at,
    
    } = value;
    // Converting Value to lower case
    const email = _email.toLowerCase();
    const fname = _fname.toLowerCase();
    const lname = _lname.toLowerCase();
    const gender = _gender.toLowerCase();
    const location = _location.toLowerCase();
    const path = req.file.path;
    const chkEmail = await getUserFromEmail(email);
    if (chkEmail) {
      return res.status(404).send(getError("Email already Exist."));
    }

    console.log(email+"Email")
    const chkphoneNo = await getUserFromPhone(phoneNo);
    console.log(chkphoneNo)
    if (chkphoneNo) {
      return res.status(404).send(getError("osama exist."));
    }

   
    const createUser = await prisma.users.create({
      data: {
        fname,
        lname,
        user_email: email,
         user_password,
         phoneNo,
         gender,
         location,
         image: path,
      }
    });
    if (createUser) {
      console.log("user created:::", createUser);
      return res
        .status(200)
        .send(getSuccessData(createUser));
    } else {
      console.log("There is some issue from server please try again later.");
      return res
        .status(404)
        .send(
          getError("There is some issue from server please try again later.")
        );
    }
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(404).send(getError(catchError.message));
    }
    return res.status(404).send(getError(catchError));
    
  }
});



router.post("/simpleLogin", trimRequest.all, async (req, res) => {
  try {
    const { error, value } = simpleLoginValidation(req.body);
    if (error) return res.status(404).send(getError(error.details[0].message));
    const { phoneNo :  phoneNo ,   user_password  :  user_password   } = value;
    const chkNumber = await getUserFromPhone(phoneNo);
  
   
    if (  chkNumber?.phoneNo != phoneNo) {
      return res.status(404).send(getError("Phone number does not exist"));
    }
    if (chkNumber?.user_password != user_password) {
      return res.status(404).send(getError("Invalid Password"));
    }
 
    const user = chkNumber;
    let Token = null;
    if(user)
    {
      Token = await createToken(user);
    }
    if(!Token)
    {
      return res.status(404).send(getError("Invalid Token"));
     
    }
    user["token"] = Token;
    //return res.status(200).send(getSuccessData(await createToken(user)));
    return res.status(200).send(getSuccessData(user));
  } catch (catchError) {
    if (catchError && catchError.message) {
      return res.status(404).send(getError(catchError.message));
    }
    return res.status(404).send(getError(catchError));
  }
});

module.exports = router;
