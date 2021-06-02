import { logger, sleep } from "@utils"
import TelegramBot from "node-telegram-bot-api"
import { checkSlots } from "./checkSlots"

export const runSlotChecks = async (bot: TelegramBot) => {
  logger.info("Starting task for checking slots")

  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
    logger.info(`Starting iteration #${i}`)
    logger.profile(`Ended iteration #${i}`)
    await checkSlots(bot)
    logger.profile(`Ended iteration #${i}`)

    logger.info("Paused task for 5 minutes")
    await sleep(1000 * 60 * 5) // wait for 5 minutes
  }
}
