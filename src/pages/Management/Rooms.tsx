import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    const unsub = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([roomId, roomData]) => ({
          roomId,
          ...(roomData as any),
        }));
        setRooms(list);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Phòng Chat</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>User 1</th>
            <th>User 2</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room: any) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.user1}</td>
              <td>{room.user2}</td>
              <td>
                <button
                  onClick={() => navigate(`/messages?roomId=${room.roomId}`)}
                  className="text-blue-600 underline"
                >
                  Xem tin nhắn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
