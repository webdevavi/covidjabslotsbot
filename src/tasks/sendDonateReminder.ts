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
  const users = await User.find()

  if (users.length > 0) {
    logger.info("Starting to send donate reminders")
    logger.profile("Ended sending donate reminders")
    for (let i = 0; i < users.length; i++) {
      await bot.sendMessage(users[i].chatId, message)
      users[i + 1] && (await sleep(1000 * 5)) // wait for 5 seconds
    }
    logger.profile("Ended sending donate reminders")
  }
}
