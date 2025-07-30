import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

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
      <div className="overflow-x-auto border rounded-md bg-white dark:bg-gray-900">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableCell isHeader>UID</TableCell>
              <TableCell isHeader>Nickname</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Online</TableCell>
              <TableCell isHeader>Phòng chat</TableCell>
              <TableCell isHeader>Trạng thái</TableCell>
              <TableCell isHeader>Tham gia</TableCell>
              <TableCell isHeader>Point công dân</TableCell>
              <TableCell isHeader>Point ảnh</TableCell>
              <TableCell isHeader>Bị khóa?</TableCell>
              <TableCell isHeader>Lý do khóa</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((u) => (
              <TableRow key={u.uid}>
                <TableCell className="break-words max-w-[200px]">{u.uid}</TableCell>
                <TableCell>{u.nickname}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.isOnline ? "🟢" : "🔴"}</TableCell>
                <TableCell>{u.activeRoomId || "-"}</TableCell>
                <TableCell>{u.status || "—"}</TableCell>
                <TableCell>
                  {u.joinedAt
                    ? new Date(u.joinedAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>{u.citizenPoint ?? 0}</TableCell>
                <TableCell>{u.photoPoint ?? 0}</TableCell>
                <TableCell>{u.isDisabled ? "🚫" : "✔️"}</TableCell>
                <TableCell>{u.banReason || "—"}</TableCell>
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
