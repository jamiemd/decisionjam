const stripe = require("stripe")("sk_test_LdNhOn0s563Qt83R14hhLyGQ");
const Billing = require("../db/BillingModel.js");
const passport = require("passport");

module.exports = app => {
  // charge customer

  app.post(
    "/api/payment",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("req.user", req.user);
      console.log("req.body", req.body);

      const stripeToken = req.body.postData.stripeToken.id;
      const selectedOption = req.body.postData.selectedOption;

      console.log("stripeToken:", stripeToken);
      let planName = "";
      if (selectedOption === "Monthly") {
        planName = "plan_CpN6kHzPE3J5bX";
      } else if (selectedOption === "HalfYearly") {
        planName = "plan_CpOfKouHLBunzy";
      } else {
        planName = "plan_CpOf1aZKax6LSf";
      }

      // create customer in stripe
      const customer = stripe.customers
        .create({
          email: req.user.email,
          source: stripeToken
        })
        .then(customer => {
          //create subscription for customer
          stripe.subscriptions.create(
            {
              customer: customer.id,
              items: [{ plan: planName }]
            },
            function(err, subscription) {
              // console.log('subscription log:', subscription);
              if (err) {
                console.log("subscription creation failed:", err);
              }
              // save customer info to database
              // console.log('subscription', subscription.id);
              const newModelData = {
                username: req.user.username,
                email: req.user.email,
                subscriptionID: subscription.id,
                subscriptionType: subscription.plan.nickname,
                amountBilled: subscription.plan.amount,
                subscriptionStartDate: subscription.current_period_start,
                subscriptionEndDate: subscription.current_period_end
              };
              const newBilling = new Billing(newModelData);
              // console.log('newBilling', newBilling);
              newBilling.save();
              res.json({
                success: true,
                message: "Card successfully charged.",
                subscriptionType: subscription.plan.nickname,
                amountBilled: subscription.plan.amount,
                subscriptionStartDate: subscription.current_period_start,
                subscriptionEndDate: subscription.current_period_end
              });
            }
          );
        })
        .catch(function(error) {
          console.log("charge failed");
          res.json({ success: false, message: "Charge failed" });
        });
    }
  );

  // when sign up as free user button clicked, save free user info in billing model
  // based on userID check subscription end date and compare with today's date
  app.get("/api/make-decision/:soID", (req, res) => {
    console.log("req.params", req.params.soID);
    const soID = req.params.soID;
    Billing.findOne({ userID: soID }).then(endDate => {
      const newDate = new Date();
      const dateToday = Math.round(newDate.getTime() / 1000);
      const subEndDate = endDate.subscriptionEndDate;
      if (dateToday > subEndDate) {
        res.send("Your Subscription has ended. Click here to re-subscribe ");
      }
    });
  });

  app.get(
    "/api/subscriptionID",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log("req", req);
      console.log("req.user", req.user);

      Billing.findOne({ username: req.user.username })
        .sort({ subscriptionID: -1 })
        .then((subscription, err) => {
          // console.log(subscription);
          if (!subscription) {
            res.json({
              success: true,
              subscriptionID: false
            });
          } else {
            res.json({
              success: true,
              subscription: subscription
            });
          }
        });
    }
  );
};
