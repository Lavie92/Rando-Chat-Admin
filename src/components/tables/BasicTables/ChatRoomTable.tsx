import { ChatRoom } from "../../../services/chatRoomService";
import { User } from "../../../services/userService";
import { useState } from "react";

interface Props {
  rooms: ChatRoom[];
  users: Record<string, User>;
}

export default function ChatRoomTable({ rooms, users }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(rooms.length / rowsPerPage);
  const paginatedRooms = rooms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getDisplayName = (uid: string): string => {
  if (!uid || typeof uid !== "string") return uid;

  const user = users?.[uid];
  if (!user) {
    console.warn("❗ Không tìm thấy user:", uid);
    return uid;
  }
  return user.nickname?.trim() ? user.nickname : user.email || uid;
};


  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

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
            {paginatedRooms.map((r) => {
              const totalMsg = Object.values(r.messageCounts).reduce((a, b) => a + b, 0);
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-2 break-all max-w-[300px]">{r.id}</td>
                  <td className="p-2">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2">{r.active ? "🟢" : "🔴"}</td>
                  <td className="p-2">
                    {r.participantIds.length > 0
                      ? r.participantIds.map(getDisplayName).join(", ")
                      : "—"}
                  </td>
                  <td className="p-2">{totalMsg}</td>
                  <td className="p-2">
                    {Object.entries(r.messagePercents)
                      .map(([uid, percent]) => `${getDisplayName(uid)}: ${percent}%`)
                      .join(" | ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-100 text-sm rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          ← Trước
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-100 text-sm rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
