import { useAuthStore } from "@/stores/useAuthStores";
import Header from "./component/Header";
import DashboardStats from "./component/DashboardStats";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();

  if (!isAdmin && isLoading) return;
  <div className="">Unauthorized</div>;
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />
      <DashboardStats />
    </div>
  );
};

export default AdminPage;
