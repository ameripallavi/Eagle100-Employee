import fs from "fs";
import jwt from "jsonwebtoken";
const publicKey = fs.readFileSync("./config/key.pub", "utf8");

// TODO add check for admin routes
export const withAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log("Error: Auth error, no auth");
    sendNotAuthorizedResponse(res);
  } else {
    const token =
      req.headers.authorization.split(" ")[0] === "Bearer"
        ? req.headers.authorization.split(" ")[1]
        : undefined;
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) {
        console.log("Error: Auth error, invalid auth");
        sendNotAuthorizedResponse(res);
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

const sendNotAuthorizedResponse = function (res) {
  res.status(401);
  res.setHeader("Content-Type", "application/json");
  res.json({ error: "Unauthorized: Invalid token" });
  res.end();
};