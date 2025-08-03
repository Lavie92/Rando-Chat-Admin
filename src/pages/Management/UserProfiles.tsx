import useUsers from "../../hooks/useUsers";
import UserTable from "../../components/tables/BasicTables/UserTable";
import { USER_DEFAULT_PAGE_SIZE } from "../../utils/constants";

export default function UserProfiles() {
  const {
    users,
    totalCount,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refreshCurrentPage,
    hasNextPage,
    hasPrevPage
  } = useUsers(USER_DEFAULT_PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Danh sách người dùng</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {totalCount} người dùng
        </div>
      </div>

      <UserTable
        users={users}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={goToPage}
        onRefresh={refreshCurrentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}
