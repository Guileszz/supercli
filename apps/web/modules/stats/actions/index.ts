"use server"

import prisma from "@super/db"

export async function getStats() {
  try {
    const [userCount, npmResponse, githubResponse] = await Promise.all([
      prisma.user.count(),
      fetch("https://api.npmjs.org/downloads/point/last-month/supercode-cli").then(
        (r) => r.json().catch(() => ({ downloads: 0 })),
      ),
      fetch("https://api.github.com/repos/yashdev9274/superCli").then((r) =>
        r.json().catch(() => ({ stargazers_count: 0 })),
      ),
    ])

    return {
      users: userCount + 100,
      downloads: (npmResponse.downloads ?? 0) + 6000,
      stars: githubResponse.stargazers_count ?? 0,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { users: 0, downloads: 0, stars: 0 }
  }
}
