import { useEffect, useState } from "react";
import { ChatRoom, fetchAllChatRooms } from "../services/chatRoomService";

export default function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchAllChatRooms();
        setRooms(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { rooms, loading };
}
