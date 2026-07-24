import chalk from "chalk"
import prisma from "src/lib/prisma"
import {
  theme,
  sectionHeader,
  heavyDivider,
  formatTokenCount,
  progressBar,
} from "src/cli/utils/tui.ts"
import { getStoredToken } from "src/lib/token"
import { getUserDailyUsage } from "src/lib/token-budget"

export async function usageCommand(): Promise<void> {
  const token = await getStoredToken()
  if (!token?.access_token) {
    console.log()
    console.log(heavyDivider())
    console.log()
    console.log(`  ${chalk.hex(theme.muted)("Not authenticated. Run /login first.")}`)
    console.log()
    console.log(heavyDivider())
    console.log()
    return
  }

  const session = await prisma.session.findUnique({
    where: { token: token.access_token as string },
    include: { user: true },
  })
  if (!session || session.expiresAt < new Date()) {
    console.log()
    console.log(heavyDivider())
    console.log()
    console.log(`  ${chalk.hex(theme.muted)("Session expired. Please re-authenticate.")}`)
    console.log()
    console.log(heavyDivider())
    console.log()
    return
  }

  const user = session.user
  const usage = await getUserDailyUsage(user.id)

  const w = Math.min(process.stdout.columns ?? 80, 72)

  console.log()
  console.log(heavyDivider())
  console.log()
  console.log(sectionHeader("Daily Usage", { accent: "green" }))
  console.log(`  ${chalk.hex(theme.muted)(`${user.email || user.name} · resets at midnight UTC`)}`)
  console.log()

  const pct = Math.min(100, Math.round((usage.used / usage.limit) * 100))
  const color =
    usage.remaining <= 10_000 ? theme.red
    : usage.remaining <= 50_000 ? theme.amber
    : theme.green

  console.log(
    `  ${chalk.hex(theme.greenGlow)("Used")}      ${formatTokenCount(usage.used).padStart(8)}  ${progressBar(usage.used, usage.limit, 16)}`
  )
  console.log(
    `  ${chalk.hex(theme.greenGlow)("Limit")}    ${formatTokenCount(usage.limit).padStart(8)}`
  )
  console.log(
    `  ${chalk.hex(color)(chalk.hex(theme.greenGlow)("Remaining"))} ${formatTokenCount(usage.remaining).padStart(8)}`
  )
  console.log()

  console.log(heavyDivider())
  console.log()
}
