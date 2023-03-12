const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");
const { connectToDatabase, SignupCollection } = require("./utils/mongodb");
const { generateId, generateCode } = require("./utils/generateCode");

// import supertest from "supertest";
// import app from "./app.js";

describe("Database connection", () => {
  let originalConnect;

  test("should call mongoose.connect with the correct arguments", () => {
    // create a mock function for mongoose.connect
    mongoose.connect = jest.fn();

    // call the function that connects to the database
    connectToDatabase();

    // check if mongoose.connect is called with the expected arguments
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_PROD_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});

describe("Test the root path", () => {
  test("It should return status code 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /signup", () => {
  //   let paymentId = generateCode();
  //   let userId = generateId();

  let userData = {
    // userId,
    name: "Mary Bae",
    password: "password",
    email: "marybae@example.com",
    // paymentIds: [`${paymentId}`],
    phone: "1234567890",
    balance: 5000,
  };

  //   beforeEach(async () => {
  //     // Clean up any existing data in the database
  //     await SignupCollection.deleteMany({});
  //   }, 20000);

  afterAll(async () => {
    // Close the database connection after all tests
    await SignupCollection.deleteOne({ email: userData.email });
    await mongoose.connection.close();
  }, 50000);

  it("should create a new user when given valid input", async () => {
    const response = await request(app)
      .post("/signup")
      .send(userData)
      .expect(200);

    expect(response.body.user).toMatchObject({
      //   userId: userData.userId,
      name: userData.name,
      email: userData.email,
      //   paymentIds: userData.paymentIds,
      phone: userData.phone,
      balance: userData.balance,
    });
  }, 50000);

  it("check if email exists and login", async () => {
    // Insert a user with the same email address
    // await new SignupCollection({
    //   name: "Jane Doe",
    //   password: "wrongpassword",
    //   email: "johndoe@example.com",
    //   phone: "0987654321",
    //   balance: userData.balance,
    // }).save();

    const response = await request(app)
      .post("/signup")
      .send(userData)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("user exists, logging in");
    expect(response.body.user.email).toBe(userData.email);

    // await SignupCollection.deleteOne({ email: newUser.email });
  }, 50000);
});
