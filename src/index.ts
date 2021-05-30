require("module-alias/register")
import { initTelegramBot } from "@config"
import { handleMessages } from "@handler"

const bot = initTelegramBot()

// handle messages
bot.on("message", (message) => handleMessages(bot, message))
