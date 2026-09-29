import { headers } from "next/headers";
import Dashboard from "@/components/dashboard";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <Dashboard userName={session?.user.name ?? "Traveller"} userImage={session?.user.image} />;
}
