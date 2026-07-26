import { getStats } from "@/modules/stats/actions"
import StatsDisplay from "./stats-display"

export const dynamic = "force-dynamic"

export default async function StatsPage() {
  const stats = await getStats()

  return <StatsDisplay stats={stats} />
}
