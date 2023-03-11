const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const SignupSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentIds: [],
  balance: Number,
});

const PaymentIdSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  paymentIds: [],
});

const TransactionsSchema = new mongoose.Schema({
  senderUserId: {
    type: String,
    required: true,
  },
  receiverUserId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  amount: String,
  timestamp: {
    type: String,
    required: true,
  },
  recipient: [],
});

const LoginCollection = mongoose.model("LoginCollection", LoginSchema);
const SignupCollection = mongoose.model("SignupCollection", SignupSchema);
const PaymentIdCollection = mongoose.model(
  "PaymentIdCollection",
  PaymentIdSchema
);
const TransactionsCollection = mongoose.model(
  "TransactionsCollection",
  TransactionsSchema
);

module.exports = {
  LoginCollection,
  SignupCollection,
  PaymentIdCollection,
  SignupSchema,
  TransactionsCollection,
};
