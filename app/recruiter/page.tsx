import { searchDevelopers, getAuthenticatedUser } from "@/lib/db/dal";
import RecruiterClient from "./RecruiterClient";
import { redirect } from "next/navigation";

export default async function RecruiterPortal() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/onboarding");
  }

  if (user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  // Initial search with no filters to populate the portal
  const developers = await searchDevelopers({});

  return (
    <RecruiterClient initialDevelopers={developers} />
  );
}
