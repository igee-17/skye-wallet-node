const { PaymentIdCollection, SignupCollection } = require("./mongodb");

const getPaymentIds = async (userId) => {
  const result = await PaymentIdCollection.findOne({ userId });

  return result ? result.paymentIds : [];
};

const addPaymentId = async (userId, paymentId) => {
  //   const User = mongoose.model("User", SignupSchema);
  //   const user = await SignupCollection.findById(userId);
  const user = await SignupCollection.findOne({ userId });
  console.log(user);
  if (
    user &&
    user.paymentIds.length < 5 &&
    !user.paymentIds.includes(paymentId)
  ) {
    user.paymentIds.push(paymentId);
    await user.save();
    console.log(`Added payment ID ${paymentId} to user ${userId}`);
    return true;
  } else {
    console.log(`Failed to add payment ID ${paymentId} to user ${userId}`);
    return false;
  }
};

const deletePaymentId = async (userId, paymentId) => {
  // const User = mongoose.model("User", userSchema);
  // const user = await User.findById(userId);
  const user = await SignupCollection.findOne({ userId });

  if (
    user &&
    user.paymentIds.includes(paymentId) &&
    user.paymentIds.length > 1
  ) {
    user.paymentIds = user.paymentIds.filter((id) => id !== paymentId);
    await user.save();
    console.log(`Deleted payment ID ${paymentId} for user ${userId}`);
    return true;
  } else {
    console.log(`Failed to delete payment ID ${paymentId} for user ${userId}`);
    return false;
  }
};

module.exports = {
  getPaymentIds,
  addPaymentId,
  deletePaymentId,
};
