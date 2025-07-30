import { useEffect, useState } from "react";
import { fetchAllUsers, User } from "../services/userService";

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  useEffect(() => {
    const fetch = async () => {
      const userMap = await fetchAllUsers();
      const userList = Object.values(userMap);
      setUsers(userList);
      setUserMap(userMap);
    };

    fetch();
  }, []);
  console.log("Users fetched:", users);
  console.log("Users fetched:", userMap);
  
  return { users, userMap };
}
