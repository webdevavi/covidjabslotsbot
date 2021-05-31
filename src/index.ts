require("module-alias/register")
import { initTelegramBot, typeormConfig } from "@config"
import { PORT } from "@constants"
import { handleMessages } from "@handler"
import { checkSlots } from "@tasks"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { createConnection } from "typeorm"
import cron from "node-cron"

const main = async () => {
  const con = await createConnection(typeormConfig)

  con.runMigrations()

  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use("*", (_, res) => res.sendStatus(200))

  const bot = initTelegramBot()

  console.log("Bot started")

  bot.on("text", (message) => handleMessages(bot, message))

  bot.once("error", console.error)

  app.listen(PORT, () => console.log(`App listening on port ${PORT}`))

  cron.schedule("*/10 * * * *", () => checkSlots(bot))
}

main()
