import { useMemo } from "react";
import useChatRooms from "../../hooks/useChatRooms";
import useUsers from "../../hooks/useUsers";
import ChatRoomTable from "../../components/tables/BasicTables/ChatRoomTable";
import { User } from "../../services/userService";
import {
  CHAT_ROOM_LIST_PAGE_SIZE,
  CHAT_ROOM_USER_FETCH_LIMIT
} from "../../utils/constants";

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
  } = useChatRooms(CHAT_ROOM_LIST_PAGE_SIZE);

  const { users } = useUsers(CHAT_ROOM_USER_FETCH_LIMIT);

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
