import fs from "fs";
import jwt from "jsonwebtoken";

const privateKEY = fs.readFileSync("././config/key");

export default (userData) => {
  try {
    return jwt.sign(userData, privateKEY, {
      expiresIn: "4h",
      algorithm: "RS256",
    });
  } catch (err) {
    console.log("JWT Error:", err);
  }
};