import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function ProfileBadgePage({
  params
}: {
  params: { slug: string };
}) {
  const profile = await prisma.profile.findUnique({
    where: { publicSlug: params.slug },
    include: { user: { include: { skillGraph: true } } }
  });

  if (!profile || !profile.user.skillGraph) {
    notFound();
  }

  const score = Math.round(profile.user.skillGraph.overallScore);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 120,
        fontFamily: "Inter, sans-serif",
        background: "#0B0B14",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0
      }}
    >
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: 16,
          background: "rgba(255,255,255,0.05)",
          minWidth: 240
        }}
      >
        <div style={{ fontSize: 12, color: "#00F5A0" }}>Hackify Verified</div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{profile.publicSlug}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Hackify Score</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{score}</div>
      </div>
    </div>
  );
}
