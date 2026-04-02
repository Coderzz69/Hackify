import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { evaluateCodeSubmission } from "@/lib/openai";
import { applyAiEvaluation } from "@/lib/skill-graph";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }


  const body = await req.json();
  const code = String(body.code || "").trim();
  const taskId = body.taskId as string | undefined;

  if (!code) {
    return new Response("Code submission required", { status: 400 });
  }

  let task = null;
  if (taskId) {
    task = await prisma.task.findUnique({ where: { id: taskId } });
  } else {
    const count = await prisma.task.count();
    const skip = count ? Math.floor(Math.random() * count) : 0;
    task = await prisma.task.findFirst({
      orderBy: { createdAt: "asc" },
      skip
    });
  }

  if (!task) {
    return new Response("No tasks available", { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await evaluateCodeSubmission({
      taskTitle: task.title,
      taskDescription: task.description,
      code
    });
  } catch (error) {
    return new Response("Evaluation failed", { status: 500 });
  }
  if (!evaluation) {
    return new Response("Evaluation failed", { status: 500 });
  }

  await prisma.evaluationResult.create({
    data: {
      userId: userId,
      taskId: task.id,
      code,
      score: evaluation.score,
      feedback: evaluation.feedback,
      breakdown: evaluation.breakdown
    }
  });

  const currentGraphRecord = await prisma.skillGraph.findUnique({
    where: { userId: userId }
  });

  const currentGraph = currentGraphRecord
    ? {
        userId: userId,
        skills: currentGraphRecord.skills as any,
        overallScore: currentGraphRecord.overallScore,
        lastUpdated: currentGraphRecord.lastUpdated.toISOString()
      }
    : {
        userId: userId,
        skills: [],
        overallScore: 0,
        lastUpdated: new Date().toISOString()
      };

  const nextGraph = applyAiEvaluation({
    graph: currentGraph,
    targetSkill: task.targetSkill,
    aiScore: evaluation.score
  });

  await prisma.skillGraph.upsert({
    where: { userId: userId },
    update: {
      skills: nextGraph.skills,
      overallScore: nextGraph.overallScore,
      lastUpdated: new Date(nextGraph.lastUpdated)
    },
    create: {
      userId: userId,
      skills: nextGraph.skills,
      overallScore: nextGraph.overallScore,
      lastUpdated: new Date(nextGraph.lastUpdated)
    }
  });

  await prisma.skillSnapshot.create({
    data: {
      userId: userId,
      snapshot: nextGraph
    }
  });

  return Response.json({
    task,
    evaluation,
    skillGraph: nextGraph
  });
}
