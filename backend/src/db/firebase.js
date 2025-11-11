import fs from "fs";
import admin from "firebase-admin";
import { ENV } from "../config/env.js";

const serviceAccount = JSON.parse(fs.readFileSync(ENV.FIREBASE_KEY_PATH, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
