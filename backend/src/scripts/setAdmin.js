import { admin } from "../db/firebase.js";

const uid = "SNigufixMXStAVVrY0wMQrDQoFr2";

const setAdminRole = async () => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(` Đã gán role 'admin' cho user UID: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error(" Lỗi khi gán quyền admin:", error.message);
    process.exit(1);
  }
};

setAdminRole();
