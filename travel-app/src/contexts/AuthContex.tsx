import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "../../utils/firebase";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export type UserData = {
  uid: string;
  email: string | null;
  role?: string | null;
  firstName?: string | null;
  idToken?: string;
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => Promise<void>;
  logout: () => Promise<void>;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  setUser: async () => { },
  logout: async () => { },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // public setUser đồng bộ state + AsyncStorage
  const setUser = async (userData: UserData | null) => {
    setUserState(userData);
    try {
      if (userData) await AsyncStorage.setItem("user", JSON.stringify(userData));
      else await AsyncStorage.removeItem("user");
    } catch (err) {
      console.log("setUser AsyncStorage error:", err);
    }
  };

  // Firebase Auth listener
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUserState(JSON.parse(storedUser));
      } catch (err) {
        console.log("Load user error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          let firstName = null;
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            firstName = data.firstName || null;
          }

          const tokenResult = await firebaseUser.getIdTokenResult(false);
          const idToken = tokenResult.token;
          const role = tokenResult.claims.role || "customer";

          // Đồng bộ vào state + AsyncStorage
          await setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role,firstName, idToken });
        } catch (err) {
          console.log("Auth listener error:", err);
        }
      } else {
        await setUser(null);
      }
      // setLoading(false); 
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      await setUser(null);
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
