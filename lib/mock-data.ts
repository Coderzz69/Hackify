export const developers = [
  {
    username: "alexchen",
    name: "Alex Chen",
    score: 842,
    avatar: "https://i.pravatar.cc/150?u=alexchen",
    skills: [
      { name: "TypeScript", value: 91 },
      { name: "React", value: 87 },
      { name: "Node.js", value: 82 },
      { name: "SQL", value: 78 },
      { name: "System Design", value: 74 },
      { name: "Python", value: 68 },
    ],
    verified: true,
    insights: {
      strengths: ["Graph Algorithms expert", "Highly efficient concurrency handling", "Clean, modular system design"],
      areasForImprovement: ["Unit testing coverage", "Documentation depth"]
    }
  },
  {
    username: "priyasharma",
    name: "Priya Sharma",
    score: 921,
    avatar: "https://i.pravatar.cc/150?u=priyasharma",
    skills: [
      { name: "Python", value: 95 },
      { name: "System Design", value: 88 },
      { name: "SQL", value: 85 },
      { name: "TypeScript", value: 82 },
      { name: "React", value: 80 },
      { name: "Node.js", value: 75 },
    ],
    verified: true,
    insights: {
      strengths: ["Advanced Python performance tuning", "Master of relational schema design", "Strong distributed systems knowledge"],
      areasForImprovement: ["Frontend state management", "CSS architecture"]
    }
  },
  {
    username: "devmarcus",
    name: "Marcus Johnson",
    score: 756,
    avatar: "https://i.pravatar.cc/150?u=devmarcus",
    skills: [
      { name: "React", value: 89 },
      { name: "TypeScript", value: 84 },
      { name: "Node.js", value: 79 },
      { name: "GraphQL", value: 75 },
      { name: "SQL", value: 70 },
      { name: "Rust", value: 65 },
    ],
    verified: false,
    insights: {
      strengths: ["Exceptional UI/UX implementation", "Modern React patterns expert", "Fast debugging skills"],
      areasForImprovement: ["Back-end architectural patterns", "Database query optimization"]
    }
  }
];

export const challenges = [
  { id: "c1", title: "Rate Limiter Pipeline", language: "TypeScript", difficulty: "Hard" },
  { id: "c2", title: "Optimized React Table", language: "React", difficulty: "Medium" },
  { id: "c3", title: "Data ETL Pipeline", language: "Python", difficulty: "Hard" },
  { id: "c4", title: "Complex Joins Map", language: "SQL", difficulty: "Medium" },
  { id: "c5", title: "Distributed Cache", language: "System Design", difficulty: "Expert" }
];
