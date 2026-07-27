"use server"

async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    return await res.json()
  } catch {
    return fallback
  }
}

export async function getStats() {
  const serverUrl = process.env.TERMINAL_SERVER_URL || "http://localhost:3004"
  const [userStats, npmResponse, githubResponse] = await Promise.all([
    safeFetchJson<{ count?: number }>(`${serverUrl}/api/data/users/count`, { count: 0 }),
    safeFetchJson<{ downloads?: number }>(
      "https://api.npmjs.org/downloads/point/last-month/supercode-cli",
      { downloads: 0 },
    ),
    safeFetchJson<{ stargazers_count?: number }>(
      "https://api.github.com/repos/yashdev9274/superCli",
      { stargazers_count: 0 },
    ),
  ])

  return {
    users: (userStats.count ?? 0) + 100,
    downloads: (npmResponse.downloads ?? 0) + 6000,
    stars: githubResponse.stargazers_count ?? 0,
  }
}
