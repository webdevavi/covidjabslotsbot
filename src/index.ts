require("module-alias/register")
import { initTelegramBot } from "@config"
import { handleMessages } from "@handler"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import { PORT } from "@constants"

const app = express()

app.use(cors())
app.use(helmet())
app.use("*", (_, res) => res.sendStatus(200))

const bot = initTelegramBot()

console.log("Bot started")

// handle messages
bot.on("message", (message) => handleMessages(bot, message))

bot.once("error", console.error)

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
