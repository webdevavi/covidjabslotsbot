require("module-alias/register")
import { initTelegramBot, typeormConfig } from "@config"
import { PORT } from "@constants"
import { handleMessages } from "@handler"
import { checkSlots } from "@tasks"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { createConnection } from "typeorm"
import { logger, sleep } from "@utils"

const main = async () => {
  const con = await createConnection(typeormConfig)

  logger.info("Database connected")

  con.runMigrations()

  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use("*", (_, res) => res.sendStatus(200))

  const bot = initTelegramBot()

  logger.info("Bot started")

  bot.on("text", (message) => handleMessages(bot, message))

  bot.on("error", logger.error)

  // running the tasks almost infinite number of times
  ;(async () => {
    logger.info("Starting task for checking slots")

    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      logger.info(`Starting iteration #${i}`)
      logger.profile(`Ended iteration #${i}`)
      await checkSlots(bot)
      logger.profile(`Ended iteration #${i}`)

      logger.info("Paused task for 5 minutes")
      await sleep(1000 * 60) // wait for 5 minutes
    }
  })()

  app.listen(PORT, () => logger.info(`App listening on port ${PORT}`))
}

main()
