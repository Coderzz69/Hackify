import { type GithubStats, type GithubRepoSummary } from "@/lib/skill-graph";

const GITHUB_API = "https://api.github.com";

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

async function fetchJson<T>(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "hackify"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchGithubStats(token: string): Promise<GithubStats> {
  const user = await fetchJson<{
    login: string;
    avatar_url: string;
    html_url: string;
  }>(`${GITHUB_API}/user`, token);

  const repos = await fetchJson<
    Array<{
      name: string;
      html_url: string;
      stargazers_count: number;
      language: string | null;
      updated_at: string;
      languages_url: string;
      owner: { login: string };
    }>
  >(`${GITHUB_API}/user/repos?per_page=100&sort=updated`, token);

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  const sortedByStars = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  const languageAccumulator: Record<string, number> = {};
  const repoSummaries: GithubRepoSummary[] = [];

  for (const repo of sortedByStars.slice(0, 10)) {
    try {
      const languages = await fetchJson<Record<string, number>>(
        repo.languages_url,
        token
      );
      Object.entries(languages).forEach(([language, bytes]) => {
        languageAccumulator[language] =
          (languageAccumulator[language] || 0) + bytes;
      });
    } catch {
      if (repo.language) {
        languageAccumulator[repo.language] =
          (languageAccumulator[repo.language] || 0) + 1;
      }
    }

    repoSummaries.push({
      name: repo.name,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at
    });
  }

  const events = await fetchJson<
    Array<{ type: string; created_at: string }>
  >(`${GITHUB_API}/users/${user.login}/events/public?per_page=100`, token);

  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const pushEvents = events.filter(
    (event) =>
      event.type === "PushEvent" &&
      new Date(event.created_at).getTime() >= ninetyDaysAgo
  );

  const commitActivityScore = clamp((pushEvents.length / 30) * 100);

  const readmeLengths: number[] = [];

  for (const repo of sortedByStars.slice(0, 5)) {
    try {
      const readme = await fetchJson<{ content: string }>(
        `${GITHUB_API}/repos/${repo.owner.login}/${repo.name}/readme`,
        token
      );
      const decoded = Buffer.from(readme.content, "base64").toString("utf-8");
      readmeLengths.push(decoded.length);
    } catch {
      readmeLengths.push(0);
    }
  }

  const avgReadmeLength =
    readmeLengths.reduce((acc, len) => acc + len, 0) /
    (readmeLengths.length || 1);
  const readmeScore = clamp((avgReadmeLength / 2000) * 100);

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    totalStars,
    totalRepos: repos.length,
    languages: languageAccumulator,
    repos: repoSummaries,
    commitActivityScore,
    readmeScore,
    lastSyncedAt: new Date().toISOString()
  };
}
