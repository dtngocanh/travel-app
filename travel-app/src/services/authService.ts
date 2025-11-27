import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email: string, password: string) => {
  try {
    //  Login bằng Firebase Client SDK
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy token JWT + custom claims (role)
    // forceRefresh = true để token luôn mới, tránh hết hạn
    const idToken = await user.getIdToken(true);
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role || "customer";

    const userData = {
      uid: user.uid,
      email: user.email,
      role,
      idToken,
    };
    
    // Trả về thông tin cần thiết
    return userData;

  } catch (error: any) {
    // Không log stack trace
    return Promise.reject({
      code: error.code || "auth/unknown-error",
      message: error.message || "Unknown login error",
    });
  }
};
