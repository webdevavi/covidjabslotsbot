require("module-alias/register")
import { initTelegramBot } from "@config"
import { handleMessages } from "@handler"

const bot = initTelegramBot()

console.log("Bot started")

// handle messages
bot.on("message", (message) => handleMessages(bot, message))

bot.once("error", console.error)
