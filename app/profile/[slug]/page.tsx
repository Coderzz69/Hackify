import { getProfileBySlug } from "@/lib/db/dal";
import ProfileClient from "./ProfileClient";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const data = await getProfileBySlug(params.slug);
  
  if (!data) {
    notFound();
  }

  // AI Insights would normally be fetched or calculated on the server
  const mockInsights = {
    strengths: ["Graph Algorithms expert", "Highly efficient concurrency handling", "Clean, modular system design"],
    areasForImprovement: ["Unit testing coverage", "Documentation depth"]
  };

  return (
    <ProfileClient 
      user={data.user} 
      skillGraph={data.skillGraph} 
      insights={mockInsights}
    />
  );
}
