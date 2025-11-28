import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { db, auth } from "../../utils/firebase";
import { collection, doc, setDoc, serverTimestamp, query, where, onSnapshot, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface Notification {
  id: string;
  tourId: string;
  message: string;
  read: boolean;
  createdAt: any;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (tourId: string, tourName: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNotifications([]);
        return;
      }

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid)
      );

      const unsubscribeSnapshot = onSnapshot(q, snapshot => {
        const notifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setNotifications(notifs);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);


  const addNotification = async (tourId: string, tourName: string) => {
    if (!auth.currentUser) return;
    const notifRef = doc(collection(db, "notifications"));
    await setDoc(notifRef, {
      id: notifRef.id,
      tourId,
      message: `You have booked the tour "${tourName}"`,
      read: false,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  const markAsRead = async (id: string) => {
    const notifRef = doc(db, "notifications", id);
    await setDoc(notifRef, { read: true }, { merge: true });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
