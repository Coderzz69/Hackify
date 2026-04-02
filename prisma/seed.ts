import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tasks = [
  {
    title: "Refactor Express Middleware",
    description:
      "Refactor the middleware to reduce repeated DB calls and add proper error handling.",
    difficulty: "medium",
    targetSkill: "JavaScript"
  },
  {
    title: "Type-Safe API Client",
    description:
      "Design a TypeScript API client with generics for CRUD operations.",
    difficulty: "hard",
    targetSkill: "TypeScript"
  },
  {
    title: "Python Data Pipeline",
    description:
      "Optimize a Python ETL pipeline to reduce memory usage by 40%.",
    difficulty: "hard",
    targetSkill: "Python"
  },
  {
    title: "SQL Index Review",
    description:
      "Review a query plan and propose indexes for a slow JOIN.",
    difficulty: "medium",
    targetSkill: "SQL"
  },
  {
    title: "System Design: Realtime Feed",
    description:
      "Design a scalable architecture for a realtime activity feed.",
    difficulty: "hard",
    targetSkill: "System Design"
  },
  {
    title: "JavaScript Caching Layer",
    description:
      "Implement an LRU cache in JavaScript with O(1) operations.",
    difficulty: "medium",
    targetSkill: "JavaScript"
  },
  {
    title: "TypeScript Discriminated Unions",
    description:
      "Model API error responses using discriminated unions.",
    difficulty: "easy",
    targetSkill: "TypeScript"
  },
  {
    title: "Python Async IO",
    description:
      "Convert a blocking API caller to use asyncio with rate limiting.",
    difficulty: "medium",
    targetSkill: "Python"
  },
  {
    title: "SQL Window Functions",
    description:
      "Compute rolling 7-day active users with window functions.",
    difficulty: "medium",
    targetSkill: "SQL"
  },
  {
    title: "System Design: Auth Service",
    description:
      "Design a token-based auth service for multi-tenant SaaS.",
    difficulty: "hard",
    targetSkill: "System Design"
  },
  {
    title: "JavaScript Error Boundaries",
    description:
      "Implement an error boundary component and recovery UI in React.",
    difficulty: "easy",
    targetSkill: "JavaScript"
  },
  {
    title: "TypeScript Utility Types",
    description:
      "Create utility types for deep partial updates with arrays.",
    difficulty: "hard",
    targetSkill: "TypeScript"
  },
  {
    title: "Python Pandas Performance",
    description:
      "Refactor pandas operations to reduce groupby runtime.",
    difficulty: "medium",
    targetSkill: "Python"
  },
  {
    title: "SQL Migration Plan",
    description:
      "Plan a zero-downtime migration for a large table.",
    difficulty: "hard",
    targetSkill: "SQL"
  },
  {
    title: "System Design: Queue Worker",
    description:
      "Design a resilient background job queue for media processing.",
    difficulty: "medium",
    targetSkill: "System Design"
  },
  {
    title: "JavaScript Memory Leak",
    description:
      "Identify and fix a memory leak in a Node.js websocket server.",
    difficulty: "hard",
    targetSkill: "JavaScript"
  },
  {
    title: "TypeScript Runtime Validation",
    description:
      "Integrate zod validation into an API route without losing types.",
    difficulty: "medium",
    targetSkill: "TypeScript"
  },
  {
    title: "Python CLI Tooling",
    description:
      "Design a CLI tool with subcommands and structured logging.",
    difficulty: "easy",
    targetSkill: "Python"
  },
  {
    title: "SQL Query Rewrite",
    description:
      "Rewrite a correlated subquery into a JOIN for performance.",
    difficulty: "medium",
    targetSkill: "SQL"
  },
  {
    title: "System Design: Feature Flags",
    description:
      "Design a feature flag system with gradual rollout support.",
    difficulty: "medium",
    targetSkill: "System Design"
  }
];

async function main() {
  for (const task of tasks) {
    await prisma.task.upsert({
      where: { title: task.title },
      update: task,
      create: task
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
