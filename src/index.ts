require("module-alias/register")
import { initTelegramBot, typeormConfig } from "@config"
import { PORT } from "@constants"
import { handleMessages } from "@handler"
import { runSlotChecks } from "@tasks"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { createConnection } from "typeorm"
import { logger } from "@utils"

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
  runSlotChecks(bot)

  app.listen(PORT, () => logger.info(`App listening on port ${PORT}`))
}

main()
