"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Onboards a new user, syncing their role to Clerk metadata and Prisma.
 * Replaces /api/onboarding/route.ts.
 */
export async function onboardUser(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const role = formData.get("role") as string;
  if (!role || (role !== "DEVELOPER" && role !== "RECRUITER")) {
    throw new Error("Invalid role selection");
  }

  try {
    // 1. Update Clerk Public Metadata (for JWT access)
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    });

    // 2. Upsert user in Prisma
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: { role: role as Role },
      create: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username || user.firstName || userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        image: user.imageUrl,
        role: role as Role,
      },
    });

    // 3. Conditional initialization for Developers
    if (role === "DEVELOPER") {
      await prisma.profile.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: {
          userId: dbUser.id,
          publicSlug: dbUser.username || dbUser.id,
        },
      });

      await prisma.skillGraph.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: {
          userId: dbUser.id,
          skills: [],
          overallScore: 0,
          lastUpdated: new Date(),
        },
      });
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Onboarding logic error:", error);
    throw new Error("Failed to complete onboarding");
  }

  // Final redirect based on role
  redirect(role === "DEVELOPER" ? "/dashboard" : "/recruiter");
}

import { aggregateDeveloperData } from "@/lib/db/aggregator";
import { generateSkillAnalysis, type SkillAnalysisResult } from "@/lib/openai";

/**
 * Triggers a full sync and AI-powered skill analysis of a developer.
 */
export async function syncAndAnalyzeDeveloper(githubToken?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // 1. Aggregate context data
    const context = await aggregateDeveloperData(userId, githubToken);

    // 2. Perform AI Skill Analysis
    const analysis = await generateSkillAnalysis({
      github: context.github,
      leetcode: context.leetcode,
      linkedin: context.linkedin,
    });

    // 3. Update SkillGraph in Prisma
    const skills = [
      { name: "Overall", value: Math.round(analysis.score) },
      { name: "GitHub", value: Math.round(analysis.subScores.github) },
      { name: "LeetCode", value: Math.round(analysis.subScores.leetcode) },
      { name: "Experience", value: Math.round(analysis.subScores.resume) },
    ];

    await prisma.skillGraph.update({
      where: { userId },
      data: {
        overallScore: analysis.score,
        skills: skills,
        lastUpdated: new Date(),
      },
    });

    // 4. Update Profile with Bio/Insights
    await prisma.profile.update({
      where: { userId },
      data: {
        bio: analysis.insights,
        githubStats: context.github as any,
        lastGithubSyncAt: new Date(),
      },
    });

    // 5. Update Clerk Metadata for fast UI access
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        score: Math.round(analysis.score),
        level: analysis.level, // "Fresher" | "Mid-Level" | "Senior"
        subScores: analysis.subScores
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/profile/${userId}`);
    
    return { success: true, analysis };
  } catch (error) {
    console.error("Critical Analysis Error:", error);
    throw new Error("Failed to complete AI analysis");
  }
}

/**
 * Evaluates a challenge submission via AI.
 */
export async function evaluateChallenge(submission: any) {
    // AI logic would go here
}
