import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

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
  photoURL?: string;
}

export default function UserTable({ users }: { users: User[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-xl bg-white dark:bg-white/[0.03] dark:border-white/[0.05]">
        <Table className="min-w-[1200px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">User</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Phòng chat</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Trạng thái</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Tham gia</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Point công dân</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Point ảnh</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Enable</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Lý do khóa</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedUsers.map((u) => (
            <TableRow key={u.uid}>
              <TableCell className="w-[250px] truncate px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={u.photoURL || "/images/user/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{u.nickname}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="w-[150px] text-sm text-gray-600 px-4 py-3 truncate">
                {u.activeRoomId || "—"}
              </TableCell>

              <TableCell className="w-[100px] px-4 py-3">
                <Badge
                  size="sm"
                  color={
                    u.status === "active"
                      ? "success"
                      : u.status === "banned"
                      ? "error"
                      : "warning"
                  }
                >
                  {u.status || "—"}
                </Badge>
              </TableCell>

              <TableCell className="w-[120px] text-sm px-4 py-3">
                {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "—"}
              </TableCell>

              <TableCell className="w-[80px] text-sm px-4 py-3 text-center">
                {u.citizenPoint ?? 0}
              </TableCell>

              <TableCell className="w-[80px] text-sm px-4 py-3 text-center">
                {u.photoPoint ?? 0}
              </TableCell>

              <TableCell className="w-[80px] text-sm px-4 py-3 text-center">
                {u.isDisabled ? "🚫" : "✔️"}
              </TableCell>

              <TableCell className="w-[200px] truncate text-sm px-4 py-3">
                {u.banReason || "—"}
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
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
