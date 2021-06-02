import { User } from "@entities"
import { Center } from "@models"
import { bundleMessages, logger, sleep } from "@utils"
import TelegramBot from "node-telegram-bot-api"

export const handleNotification = async (
  bot: TelegramBot,
  chatId: number,
  centers: Center[]
) => {
  const messages = await bundleMessages(chatId, centers)

  ;(async () => {
    for (let i = 1; i < messages.length; i++) {
      try {
        bot.sendMessage(chatId, messages[i], { parse_mode: "HTML" })
      } catch (error) {
        logger.error(
          `Failed to send message to chat ${chatId}; ${error.response?.body?.description}`
        )

        if (
          error.response?.body?.description?.includes(
            "bot was blocked by the user"
          )
        ) {
          User.delete({ chatId })
          break
        }
      }

      await sleep(1000 * 5) // wait for 5 seconds
    }
  })()
}
