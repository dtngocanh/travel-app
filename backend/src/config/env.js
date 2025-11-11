import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 3000,
  FIREBASE_KEY_PATH: process.env.FIREBASE_KEY_PATH,
};
