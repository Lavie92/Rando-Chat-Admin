import { ChatRoom } from "../../../services/chatRoomService";
import { User } from "../../../services/userService";
import { getDisplayName } from "../../../utils/displayName";
import Pagination from "../../common/Pagination"; 
interface Props {
  rooms: ChatRoom[];
  users: Record<string, User>;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ChatRoomTable({
  rooms,
  users,
  currentPage,
  totalPages,
  totalCount,
  loading,
  error,
  onRefresh,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: Props) {

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">❌ Lỗi: {error}</div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded border bg-white dark:bg-gray-900">
        <table className="min-w-[1200px] w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2">Room ID</th>
              <th className="p-2">Ngày tạo</th>
              <th className="p-2">Active</th>
              <th className="p-2">Người tham gia</th>
              <th className="p-2">Tổng tin nhắn</th>
              <th className="p-2">Phần trăm tin nhắn</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => {
              const totalMsg = Object.values(r.messageCounts).reduce((a, b) => a + b, 0);
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-2 break-all max-w-[300px]">{r.id}</td>
                  <td className="p-2">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-2">{r.active ? "🟢" : "🔴"}</td>
                  <td className="p-2">
                    {r.participantIds.length > 0
                      ? r.participantIds.map((uid) => getDisplayName(uid, users)).join(", ")
                      : "—"}
                  </td>
                  <td className="p-2">{totalMsg}</td>
                  <td className="p-2">
                    {Object.entries(r.messagePercents)
                      .map(([uid, percent]) => `${getDisplayName(uid, users)}: ${percent}%`)
                      .join(" | ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        loading={loading}
        onRefresh={onRefresh}
        label="rooms" 
      />
    </div>
  );
}
