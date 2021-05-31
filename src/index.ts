require("module-alias/register")
import { initTelegramBot, typeormConfig } from "@config"
import { PORT } from "@constants"
import { User } from "@entities"
import { handleMessages } from "@handler"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { createConnection } from "typeorm"

const main = async () => {
  await createConnection(typeormConfig())
  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use("*", (_, res) => res.sendStatus(200))

  const bot = initTelegramBot()

  console.log("Bot started")

  bot.on("text", (message) => handleMessages(bot, message))

  bot.once("error", console.error)

  app.listen(PORT, () => console.log(`App listening on port ${PORT}`))

  User.find({ relations: ["districts"] }).then((data) =>
    console.log(JSON.stringify(data, null, 2))
  )
}

main()
