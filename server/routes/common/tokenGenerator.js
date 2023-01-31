import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const privateKEY = fs.readFileSync(path.join(process.cwd(), './config/key'), 'utf-8').split(String.raw`\n`).join('\n');

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
