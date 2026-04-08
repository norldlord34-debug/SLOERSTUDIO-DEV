import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardExperience from "@/components/app/DashboardExperience";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { name?: string; email?: string; plan?: string; role?: string };
  const firstName = user.name?.split(" ")[0] ?? "Builder";

  return (
    <DashboardExperience firstName={firstName} plan={user.plan ?? "FREE"} role={user.role} />
  );
}
