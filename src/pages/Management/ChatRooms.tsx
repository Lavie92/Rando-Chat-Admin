import { useEffect, useState } from "react";
import { ChatRoom, fetchAllChatRooms } from "../../services/chatRoomService";
import { fetchAllUsers, User } from "../../services/userService";
import ChatRoomTable from "../../components/tables/BasicTables/ChatRoomTable";

export default function ChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    const getData = async () => {
      const [chatrooms, userMap] = await Promise.all([
        fetchAllChatRooms(),
        fetchAllUsers(),
      ]);
      setRooms(chatrooms);
      setUsers(userMap);
    };
    getData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lí ChatRoom</h2>
      <ChatRoomTable rooms={rooms} users={users} />
    </div>
  );
}
