import fs from "fs";
import admin from "firebase-admin";
import { ENV } from "../config/env.js";

// console.log("🔥 Đường dẫn file service account:", ENV.FIREBASE_KEY_PATH);


const serviceAccount = JSON.parse(fs.readFileSync(ENV.FIREBASE_KEY_PATH, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export {admin, db }
