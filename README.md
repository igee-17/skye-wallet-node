# skye-wallet-node

### Start Applcation

```javascript
node index.js
```

# API Documentation

## Welcome to the documentation for this API! Below you'll find a detailed description of the endpoints available.

## Base URL

```javascript
https://skyewallet.onrender.com
```

### Signup
POST /signup
Sign up a new user with the provided details.
Request


```javascript
POST /signup HTTP/1.1

Content-Type: application/json
{
  "name": "John Doe",
  "password": "johndoe123",
  "email": "johndoe@example.com",
  "phone": "1234567890"
}
```

### Response

```javascript
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Welcome, John Doe",
  "user": {
    "userId": "b8d2f2f5-0ebd-4cc8-bf5b-e6795b9fa5e1",
    "name": "John Doe",
    "password": "johndoe123",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "paymentIds": ["A1B2C3D4"],
    "balance": 5000
  }
}

```

## Login

POST /login

Log in an existing user with the provided details.

### Request


JavaScript

```javascript
POST /login HTTP/1.1
Content-Type: application/json
{
  "email": "johndoe@example.com",
  "password": "johndoe123"
}

```

### Response

```javascript
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "success",
  "user": {
    "userId": "b8d2f2f5-0ebd-4cc8-bf5b-e6795b9fa5e1",
    "name": "John Doe",
    "password": "johndoe123",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "paymentIds": ["A1B2C3D4"],
    "balance": 5000
  }
}
```


## Payment IDs

### Add Payment ID

POST /payment_ids

Add a new payment ID for the specified user.

### Request

```javascript
POST /payment_ids HTTP/1.1
Content-Type: application/json
{
  "userId": "b8d2f2f5-0ebd-4cc8-bf5b-e6795b9fa5e1",
  "email": "johndoe@example.com"
}
```


### Response

```javascript
HTTP/1.1 201 Created
Content-Type: application/json
{
  "paymentId": "E5F6G7H8"
}

```

## Delete Payment ID

DELETE /users/:userId/paymentIds/:paymentId

Delete the specified payment ID for the specified user.


### Request

```javascript
DELETE /users/0ebd4cc8/paymentIds/b8d2f2f5
```

### Response

```javascript
Status: 204 No Content
```


## Transactions

## Create Transaction



```javascript
PUT /transactions/new
```
PUT /transactions/new
Create a new transaction between two users.

Request Body

```javascript
{
  "data": {
    "senderId": "string",
    "receiverId": "string",
    "amount": "number",
    "userId": "string",
    "receiverUserId": "string"
  }
}
```


- senderId: The payment ID of the sender.
- receiverId: The payment ID of the receiver.
- amount: The amount to be transferred.
- userId: The user ID of the sender.
- receiverUserId: The user ID of the receiver.
- Response


```javascript

{
  "message": "Money transfer successful",
  "user": {
    "paymentIds": [
      "string"
    ],
    "transactions": [
      {
        "_id": "string",
        "senderId": "string",
        "receiverId": "string",
        "amount": "number",
        "senderUserId": "string",
        "receiverUserId": "string",
        "timestamp": "string",
        "recipient": {
          "_id": "string",
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phoneNumber": "string",
          "balance": "number",
          "__v": "number"
        },
        "__v": "number"
      }
    ],
    "_id": "string",
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string",
    "balance": "number",
    "__v": "number"
  }
}
```

-message: A message indicating that the money transfer was successful.
- user: The updated user object of the sender.
- GET /transactions/history/:userId
- Get the transaction history of a user.

Parameters

userId: The ID of the user whose transaction history is to be retrieved.

### Response
```javascript

[
  {
    "_id": "string",
    "senderId": "string",
    "receiverId": "string",
    "amount": "number",
    "senderUserId": "string",
    "receiverUserId": "string",
    "timestamp": "string",
    "recipient": {
      "_id": "string",
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "balance": "number",
      "__v": "number"
    },
    "type": "string",
    "__v": "number"
  }
]
```


- An array of transaction objects, each containing the following fields:
- _id: The ID of the transaction.
- senderId: The payment ID of the sender.
- receiverId: The payment ID of the receiver.
- amount: The amount transferred.
- senderUserId: The user ID of the sender.
- receiverUserId: The user ID of the receiver.
- timestamp: The timestamp of the transaction.
- recipient: The user object of the recipient.
- type: The type of the transaction, either "send" or "receive".
