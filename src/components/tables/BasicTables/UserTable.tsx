import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Pagination from "../../common/Pagination";

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

interface UserTableProps {
  users: User[];
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function UserTable({
  users,
  loading = false,
  error = null,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onRefresh,
  hasNextPage,
  hasPrevPage
}: UserTableProps) {

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
      {users.length === 0 && !loading ? (
        <div className="border rounded-xl bg-white dark:bg-white/[0.03] dark:border-white/[0.05] p-8 text-center">
          <div className="text-gray-500 text-lg">📭 Không có dữ liệu</div>
          <div className="text-gray-400 text-sm mt-2">Chưa có người dùng nào trong hệ thống</div>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white dark:bg-white/[0.03] dark:border-white/[0.05]">
          <Table className="min-w-[1200px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Phòng chat</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Trạng thái</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Online</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Tham gia</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Point công dân</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Point ảnh</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Enable</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Lý do khóa</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((u) => (
                <TableRow key={u.uid} className={loading ? "opacity-50" : ""}>
                  <TableCell className="w-[250px] truncate px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photoURL || "/images/user/default-avatar.png"}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={u.nickname}
                      />
                      <div>
                        <div className="font-semibold">{u.nickname}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[150px] text-sm text-gray-600 px-4 py-3 truncate">
                    {u.activeRoomId?.trim() ? u.activeRoomId : "—"}
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

                  <TableCell className="w-[80px] text-sm px-4 py-3 text-center">
                    {u.isOnline ? "🟢" : "⚪"}
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
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        loading={loading}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={onPageChange}
        onRefresh={onRefresh}
        label="users"
      />
    </div>
  );
}
