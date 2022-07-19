// const router = require("express").Router();
// const PUBLISHABLE_KEY =
//   "pk_test_51KMeviLKgZAbMa8MNQxtiWb3tlrLMaVMJNZbaVfiUFneoYbUTnKgoMvftaSlx3uqba8Azkrq3ieQUfrhL8gtDbac000OiIxEyU";
// const SECRET_KEY =
//   "sk_test_51KMeviLKgZAbMa8M7CwIf4Dc3GoBDRDoorF3xRO52r3c38SwzCaB80efcP7X3yEGz9n1XAbVvQGImUhhHJP06nxI00KzIkSmLb";

// const Stripe = require('stripe');
// const stripe = Stripe("sk_test_51KMeviLKgZAbMa8M7CwIf4Dc3GoBDRDoorF3xRO52r3c38SwzCaB80efcP7X3yEGz9n1XAbVvQGImUhhHJP06nxI00KzIkSmLb");
// const {
//     getError,
//     getSuccessData,
// } = require("../helper_functions/helpers");
// // This example sets up an endpoint using the Express framework.
// // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

// router.get('/get_publish_key', async (req, res) => {
//     return res.status(200).send(getSuccessData(PUBLISHABLE_KEY));
// });

// router.post('/create-payment-intent', async (req, res) => {
//     const { paymentMethodTypes, amount, currency } = req.body;
//     try {
//         const createPaymentIntent = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: currency,
//             payment_method_types: [paymentMethodTypes],
//         });
//         return res.status(200).send(getSuccessData({ clientSecret: createPaymentIntent.client_secret }));
//     } catch (error) {
//         if (error && error.message) {
//             return res.status(404).send(getError(error.message));
//         }
//         return res.status(404).send(getError(error));
//     }
// });

// // router.post("/paymentCharging", async (req, res) => {
// //     console.log("iam req::", req.body);
// //     const { amount, currency, paymentMethodType } = req.body;
    
// //   //   const { paymentMethodType, currency, amount } = req.body;
// //   // Use an existing Customer ID if this is a returning customer.
// //   //   const customer = await stripe.customers.create();
// //   //   const ephemeralKey = await stripe.ephemeralKeys.create(
// //   //     {customer: customer.id},
// //   //     {apiVersion: '2020-08-27'}
// //   //   );
// //   try {
      
// //     //     var ID = ''
// //     //     const paymentIntents = await stripe.paymentIntents.list({

// //     //     });
// //     //     const chk = paymentIntents.data;
// //     //     chk.forEach(data => {
// //     //         ID = data.id;
// //     //     });

// //     // const paymentIntentConfirM = await stripe.paymentIntents.confirm(
// //     //     ID,
// //     //   { payment_method: 'pm_card_visa' }
// //     //     );
// //     //     return res.json({
// //     //         paymentIntentConfirM,
// //     //       });
// //       const paymentIntentCreate = await stripe.paymentIntents.create({
// //           amount: amount,
// //           currency: currency,
// //           // customer: customer.id,
// //           payment_method_types: [paymentMethodType],
// //       });
// //       console.log(paymentIntentCreate);
// //     const PaymentIntentId = paymentIntentCreate.id;
// //     const paymentIntentConfirm = await stripe.paymentIntents.confirm(
// //         PaymentIntentId,
// //         {
// //             payment_method: paymentMethodType,
// //         }
// //     );

// //       return res.json({
// //         //   publishAbleKey: PUBLISHABLE_KEY,
// //         //   paymentIntent: paymentIntentCreate.client_secret,
// //         paymentIntentConfirm,
// //     });
// //   } catch (error) {
// //     return res.status(404).json({ error: { message: error.message } });
// //   }
// // });

// // app.post("/pay", async (req, res) => {
// //     const { paymentMethodId, paymentIntentId, currency, useStripeSdk } = req.body;
  
// //     try {
// //       let intent;
// //       if (paymentMethodId) {
// //         // Create new PaymentIntent with a PaymentMethod ID from the client.
// //         intent = await stripe.paymentIntents.create({
// //           amount: amount,
// //           currency: currency,
// //           payment_method: paymentMethodId,
// //           confirmation_method: "manual",
// //           confirm: true,
// //           // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
// //           // to take advantage of new authentication features in mobile SDKs
// //           use_stripe_sdk: useStripeSdk,
// //         });
// //         // After create, if the PaymentIntent's status is succeeded, fulfill the order.
// //       } else if (paymentIntentId) {
// //         // Confirm the PaymentIntent to finalize payment after handling a required action
// //         // on the client.
// //         intent = await stripe.paymentIntents.confirm(paymentIntentId);
// //         // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
// //       }
// //       res.send(generateResponse(intent));
// //     } catch (e) {
// //       // Handle "hard declines" e.g. insufficient funds, expired card, etc
// //       // See https://stripe.com/docs/declines/codes for more
// //       res.send({ error: e.message });
// //     }
// //   });
  
// //   const generateResponse = intent => {
// //     // Generate a response based on the intent's status
// //     switch (intent.status) {
// //       case "requires_action":
// //       case "requires_source_action":
// //         // Card requires authentication
// //         return {
// //           requiresAction: true,
// //           clientSecret: intent.client_secret
// //         };
// //       case "requires_payment_method":
// //       case "requires_source":
// //         // Card was not properly authenticated, suggest a new payment method
// //         return {
// //           error: "Your card was denied, please provide a new payment method"
// //         };
// //       case "succeeded":
// //         // Payment is complete, authentication not required
// //         // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
// //         console.log("💰 Payment received!");
// //         return { clientSecret: intent.client_secret };
// //     }
// //   };

// module.exports = router;
