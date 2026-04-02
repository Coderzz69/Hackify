import { getAuthenticatedUser, getSkillGraph } from "@/lib/db/dal";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect("/onboarding");
  }

  const skillGraph = await getSkillGraph(user.id);

  return (
    <DashboardClient 
      user={user} 
      skillGraph={skillGraph} 
    />
  );
}
