const { randomBytes } = require("crypto");

const generateCode = () => {
  const buffer = randomBytes(4); // generate 4 random bytes
  const code = buffer
    .toString("base64") // convert to base64 string
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumeric characters
    .slice(0, 4); // take first 4 characters

  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${code}${number}`;
};
const generateId = () => {
  const buffer = randomBytes(8); // generate 4 random bytes
  const code = buffer
    .toString("base64") // convert to base64 string
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumeric characters
    .slice(0, 6); // take first 6 characters

  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${code}${number}`;
};

module.exports = { generateCode, generateId };
