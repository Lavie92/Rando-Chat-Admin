import useUsers from "../../hooks/useUsers";
import UserTable from "../../components/tables/BasicTables/UserTable";

export default function UserProfiles() {
  const users = useUsers();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <UserTable users={users} />
    </div>
  );
}
