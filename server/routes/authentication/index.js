import { Router } from "express";
import { sendFailedResponse, sendSuccessResponse } from "../common/common.js";
import { sendOtp, login, createUser, verifyOtp,verifyUser } from "../../services/authentication/index.js";

const router = Router();

router.post("/send_otp",async (req,res) =>{
  try {
    const result = await sendOtp(req);
    sendSuccessResponse(res, result);
  }catch (err){
    sendFailedResponse(res, err);
  }
});

router.post("/verify_otp", async (req, res) => {
  try {
    const result = await verifyOtp(req);
    sendSuccessResponse(res, result);
  } catch (err) {
    sendFailedResponse(res, err);
  }
});

router.post("/verify_user", async (req, res) => {
  try {
    const result = await verifyUser(req);
    sendSuccessResponse(res, result);
  } catch (err) {
    sendFailedResponse(res, err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await login(req);
    console.log("result",result)
    sendSuccessResponse(res, result);
  } catch (err) {
    sendFailedResponse(res, err);
    console.log("err",err);
  }
});

 router.post("/forgot_password", async (req, res) => {
  try {
    const result = await forgotPassword(req);
      sendSuccessResponse(res, result);
   } catch (err) {
      sendFailedResponse(res, err);
    }
  });

  router.post("/password-reset", async (req, res) => {
   try {
      const result = await passwordReset(req);
      sendSuccessResponse(res, result);
     } catch (err) {
       sendFailedResponse(res, err);
     }
   });
 

// router.post("/verify_otp", async (req, res) => {
//   try {
//     const result = await verifyOTP(req);
//     sendSuccessResponse(res, result);
//   } catch (err) {
//     sendFailedResponse(res, err);
//   }
// });


// router.post("/verify_email", async (req, res) => {
//   try {
//     const result = await verify_email(req);
//     sendSuccessResponse(res, result);
//   } catch (err) {
//     sendFailedResponse(res, err);
//   }
// });


router.post("/create_user", async (req, res) => {
  try {
    const result = await createUser(req);
    console.log("result",result)
    return sendSuccessResponse(res, result );
  } catch (err) {
    return sendFailedResponse(res, err);
  }
});

export default router;
