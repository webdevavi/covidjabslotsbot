import { User } from "@entities"
import { logger, sleep } from "@utils"
import TelegramBot from "node-telegram-bot-api"
import { schedule } from "node-cron"

const message = `Hi \u{1F607}

I created this bot only to help you all out, and not for any personal profit or so. \u{2705}

The time and hard work I put to make this bot better every day, that can't be paid off in any way. But in order to keep this bot up and running I need your help as I have to pay for the server and database. \u{1F4BB}

If this bot could help you, you can donate any amount you wish at https://buymeacoff.ee/webdevavi. \u{1F680}

Or you can just say Hi \u{1F44B} at @webdevavi and share your feedback with me.

Thanks! \u{1F600}`

export const sendDonateReminder = async (bot: TelegramBot) => {
  // at 10AM
  scheduleReminders("0 10 * * *", bot)

  // at 2PM
  scheduleReminders("0 14 * * *", bot)

  // at 6PM
  scheduleReminders("0 18 * * *", bot)

  // at 10PM
  scheduleReminders("0 22 * * *", bot)
}

const scheduleReminders = (expression: string, bot: TelegramBot) =>
  schedule(expression, () => sendReminders(bot), {
    scheduled: true,
    timezone: "Asia/Kolkata",
  })

const sendReminders = async (bot: TelegramBot) => {
  const users = await User.find({ relations: ["districts"] }).then((users) =>
    users.filter((user) => user.districts?.length && user.districts.length > 0)
  )

  if (users.length > 0) {
    logger.info(`Starting to send donate reminders to ${users.length} chats`)
    logger.profile("Ended sending donate reminders")
    for (let i = 0; i < users.length; i++) {
      const { chatId } = users[i]

      await sleep(1000 * 5) // wait for 5 seconds

      try {
        logger.info(`Sending donate reminder to chat ${chatId}`)
        await bot.sendMessage(chatId, message)
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
        }
      }
    }
    logger.profile("Ended sending donate reminders")
  }
}
