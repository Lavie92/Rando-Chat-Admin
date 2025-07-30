import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";

export interface User {
  uid: string;
  email: string;
  nickname: string;
  isOnline: boolean;
  lastUpdated?: number;
  isDisabled?: boolean;
  activeRoomId?: string;
  status?: string;
  joinedAt?: number;
  inChatRoom?: boolean;
  citizenPoint?: number;
  photoPoint?: number;
  banReason?: string;
  isEmailVerified?: boolean;
}

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([uid, userData]) => ({
          uid,
          ...(userData as any),
        }));
        setUsers(list);
      }
    });

    return () => unsub();
  }, []);

  return users;
}
