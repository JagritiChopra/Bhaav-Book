import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Load base64 string from environment variable
const base64 = process.env.GOOGLE_SERVICE_ACCOUNT;

if (!base64) {
  throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variable");
}

// Decode the base64 string to a JSON object
// console.log("GOOGLE_SERVICE_ACCOUNT =", process.env.GOOGLE_SERVICE_ACCOUNT?.slice(0, 100));

const serviceAccount = JSON.parse(
  Buffer.from(base64, 'base64').toString('utf-8')
);

// Initialize Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;