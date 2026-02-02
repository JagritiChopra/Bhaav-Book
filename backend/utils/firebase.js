import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  const base64 = process.env.GOOGLE_SERVICE_ACCOUNT;

  if (!base64) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variable");
  }

  const serviceAccount = JSON.parse(
    Buffer.from(base64, "base64").toString("utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
