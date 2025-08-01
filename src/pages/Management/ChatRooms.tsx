import { useMemo } from "react";
import useChatRooms from "../../hooks/useChatRooms";
import useUsers from "../../hooks/useUsers";
import ChatRoomTable from "../../components/tables/BasicTables/ChatRoomTable";
import { User } from "../../services/userService";

export default function ChatRooms() {
  const {
    rooms,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    refreshCurrentPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = useChatRooms(5); 

  const { users } = useUsers(100); 

  const userMap: Record<string, User> = useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach((u) => {
      map[u.uid] = u;
    });
    return map;
  }, [users]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Quản lí ChatRoom</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {totalCount} phòng
        </div>
      </div>

      <ChatRoomTable
        rooms={rooms}
        users={userMap}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        loading={loading}
        error={error}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        onRefresh={refreshCurrentPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}
