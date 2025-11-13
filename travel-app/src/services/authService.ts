import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";

export const loginUser = async (email: string, password: string) => {
  try {
    // 1️⃣ Login bằng Firebase Client SDK
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Lấy token JWT + custom claims (role)
    // forceRefresh = true để token luôn mới, tránh hết hạn
    const idToken = await user.getIdToken(true);
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role || "customer";

    // 3️⃣ Trả về thông tin cần thiết
    return {
      uid: user.uid,
      email: user.email,
      role,
      idToken, // token mới nhất để gọi API
    };
  } catch (error: any) {
    // ❌ Không log stack trace
    return Promise.reject({
      code: error.code || "auth/unknown-error",
      message: error.message || "Unknown login error",
    });
  }
};
