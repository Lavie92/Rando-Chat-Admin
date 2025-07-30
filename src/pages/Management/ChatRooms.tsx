import useChatRooms from "../../hooks/useChatRooms";
import useUsers from "../../hooks/useUsers";
import ChatRoomTable from "../../components/tables/BasicTables/ChatRoomTable";

export default function ChatRooms() {
  const { rooms, loading: loadingRooms } = useChatRooms();
  const { userMap: users } = useUsers(); 

  if (loadingRooms) {
    return <div className="p-6 text-gray-500">Đang tải dữ liệu phòng chat...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lí ChatRoom</h2>
      <ChatRoomTable rooms={rooms} users={users} />
    </div>
  );
}
