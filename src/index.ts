require("module-alias/register")
import { initTelegramBot } from "@config"
import { PORT } from "@constants"
import { handleMessages } from "@handler"
import express from "express"

const app = express()

const bot = initTelegramBot()

// handle messages
bot.on("message", (message) => handleMessages(bot, message))

app.use("*", (_, res) =>
  res.status(200).send("Welcome to CovidJabSlotsBot server.")
)

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
