import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminOverview } from "@/lib/admin-api";

export default async function HomePage() {
  const overview = await getAdminOverview();

  return <AdminDashboard {...overview} />;
}
