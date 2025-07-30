import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import UserTable from "../../components/tables/BasicTables/UserTable";


interface User {
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

export default function UserProfiles() {
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <UserTable users={users} />
    </div>
  );
}
