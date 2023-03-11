const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const {
  SignupCollection,
  PaymentIdCollection,
  TransactionsCollection,
} = require("./utils/mongodb");
const { generateCode, generateId } = require("./utils/generateCode");
const {
  getPaymentIds,
  addPaymentId,
  deletePaymentId,
} = require("./utils/paymentId");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname + "/public")));

// allows to send information from frontend to backend
app.use(cors());
app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname), "public", "index.html");
});

// SIGNUP ROUTE

app.post("/signup", async (req, res) => {
  console.log("signup requested");

  let paymentId = generateCode();
  let userId = generateId();

  const data = {
    userId,
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    paymentIds: [`${paymentId}`],
    balance: 5000,
  };

  const paymentIdData = {
    userId,
    paymentIds: [`${paymentId}`],
  };

  const check = await SignupCollection.findOne({ email: req.body.email });

  console.log(check, "help");

  if (!check) {
    console.log("creating user");
    console.log(data, paymentId);

    const newUser = new SignupCollection(data);

    const newPaymentId = new PaymentIdCollection(paymentIdData);

    await newPaymentId.save();

    await newUser.save().then(async () => {
      console.log("Saved new user");

      res.status(201).send({
        message: `Welcome, ${data.name}`,
        user: {
          ...data,
          paymentId,
        },
      });
    });
  } else {
    console.log("user exists, loging in");

    let reqEmail = req.body.email;
    let reqPassword = req.body.password;

    try {
      const check = await SignupCollection.findOne({ email: reqEmail });

      console.log(check);

      if (check.password === reqPassword) {
        console.log("user found");
        console.log("user exists, logging in");
        res.status(200).send({
          message: "user exists, logging in",
          user: check,
        });
      } else {
        res.status(409).send("User exists, wrong password");
      }
    } catch (error) {
      res.status(409).send("wrong details");
      console.log(error);
    }
  }
});

// LOGIN ROUTE

app.post("/login", async (req, res) => {
  console.log("login requested");

  let reqEmail = req.body.email;
  let reqPassword = req.body.password;

  try {
    const check = await SignupCollection.findOne({ email: reqEmail });

    console.log(check);

    if (check.password === reqPassword) {
      console.log("user found");
      res.status(200).send({
        message: "success",
        user: check,
      });
    } else {
      res.send("wrong password");
    }
  } catch (error) {
    res.status(404).send("wrong details");
    console.log(error);
  }
});

// PAYMENT ID ROUTE
app.post("/payment_ids", async (req, res) => {
  const user = req.body; // assume user is authenticated

  const { email, userId } = user;

  const paymentIds = await getPaymentIds(userId);

  console.log(paymentIds, "user");

  if (paymentIds.length >= 5) {
    res.status(400).json({ error: "Maximum payment IDs reached" });
  } else {
    const paymentId = generateCode();

    console.log("adding payment id");
    // await addPaymentId(user.id, paymentId);
    const approval = await addPaymentId(userId, paymentId);
    console.log(approval);

    if (approval) {
      res.status(201).json({ paymentId });
    } else {
      res.status(400).json({ error: "Maximum payment IDs reached" });
    }
  }
});

// DELETE PAYMENT ID ROUTE
app.delete("/users/:userId/paymentIds/:paymentId", async (req, res) => {
  console.log("delete requested");
  const userId = req.params.userId;
  const paymentId = req.params.paymentId;

  try {
    const deleted = await deletePaymentId(userId, paymentId);
    if (deleted) {
      res.status(200).json({
        message: `Payment ID ${paymentId} deleted for user ${userId}`,
        paymentId,
      });
    } else {
      res.status(404).json({
        message: `Payment ID ${paymentId} not found for user ${userId}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  GET ALL USERS
app.get("/get-all-users", async (req, res) => {
  console.log("get users requested");
  try {
    const users = await SignupCollection.find();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  GET SINGLE USER
app.post("/get-user/:userId", async (req, res) => {
  // console.log("get user requested");
  const { userId } = req.body;
  // const userId = req.params.userId;
  console.log(userId, "userId", req.body);

  try {
    const user = await SignupCollection.findOne({ userId });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  TRANSACTIONS ROUTE
app.put("/transactions/new", async (req, res) => {
  const { senderId, receiverId, amount, userId, receiverUserId } =
    req.body.data;
  // console.log(userId, "userId", req.body);
  const recipient = await SignupCollection.findOne({
    userId: receiverUserId,
  });

  const timestamp = new Date();

  const data = {
    senderId,
    receiverId,
    amount,
    senderUserId: userId,
    receiverUserId,
    timestamp,
    recipient,
  };

  // let sender = await SignupCollection.findOne({ paymentIds: { senderId } });

  // let receiver = await SignupCollection.findOne({ paymentIds: { senderId } });
  console.log(data, req.body);

  const newTransaction = new TransactionsCollection(data);
  await newTransaction.save();

  // ---------------------------------------------------------
  // Find the sender user and check their current balance
  SignupCollection.findOne({ paymentIds: senderId })
    .then((sender) => {
      if (!sender) {
        // Handle the case where the sender user is not found
        return res.status(404).json({ error: "Sender not found" });
      }

      if (sender.balance < amount) {
        // Handle the case where the sender balance is not enough to send the amount
        return res.status(400).json({ error: "Sender balance is not enough" });
      }
      console.log("step 1");

      // Proceed with the money transfer
      SignupCollection.findOneAndUpdate(
        { paymentIds: senderId },
        { $inc: { balance: -amount } },
        { new: true }
      )
        .then((updatedSender) => {
          // Update the balance of the receiver user
          console.log("step 2");
          SignupCollection.findOneAndUpdate(
            { paymentIds: receiverId },
            { $inc: { balance: amount } },
            { new: true }
          )
            .then((updatedReceiver) => {
              // Handle the successful money transfer
              return res.json({
                message: "Money transfer successful",
                user: updatedSender,
              });
            })
            .catch((error) => {
              // Handle the error while updating the receiver user's balance
              return res.status(500).json({ error: error.message });
            });
        })
        .catch((error) => {
          // Handle the error while updating the sender user's balance
          return res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      // Handle the error while finding the sender user
      return res.status(500).json({ error: error.message });
    });
});

// GET USER TRANSACTION HISTORY
app.get("/transactions/history/:userId", async (req, res) => {
  try {
    const transactions = await TransactionsCollection.find({
      $or: [
        { senderUserId: req.params.userId },
        { receiverUserId: req.params.userId },
      ],
    });

    // Add 'type' field to each transaction
    const transactionsWithTypes = transactions.map((transaction) => {
      const type =
        transaction.senderUserId === req.params.userId ? "send" : "receive";
      return { ...transaction.toObject(), type };
    });

    res.status(200).json(transactionsWithTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
