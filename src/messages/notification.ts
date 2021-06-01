import { User } from "@entities"
import { fromTimestamp, logger, toTimestamp } from "@utils"
import { add, isBefore } from "date-fns"
import { Center } from "models/center"
import TelegramBot from "node-telegram-bot-api"

export const handleNotification = async (
  bot: TelegramBot,
  chatId: number,
  centers: Center[]
) => {
  User.findOne(chatId).then(async (user) => {
    if (user) {
      let notifiedSessions = JSON.parse(
        user.notifiedSessions ?? "[]"
      ) as string[]

      notifiedSessions = notifiedSessions
        ? notifiedSessions?.filter((session) => {
            const expiry = fromTimestamp(session?.split(":")?.[1] ?? "")

            return expiry ? isBefore(new Date(), expiry) : false
          })
        : []

      centers.forEach((center, index) =>
        setTimeout(async () => {
          const slotsToNotify = center.validSessionIds.filter(
            (sessionId) =>
              !notifiedSessions
                ?.map(
                  (sessionWithTimestamp) => sessionWithTimestamp.split(":")?.[0]
                )
                .includes(sessionId)
          )

          notifiedSessions = [
            ...notifiedSessions,
            ...slotsToNotify.map(
              (session) =>
                `${session}:${toTimestamp(
                  add(new Date(), { days: 1 }).toString()
                )}`
            ),
          ]

          user.notifiedSessions = JSON.stringify(notifiedSessions)

          await user.save()

          const messages = center.getMessages(slotsToNotify)

          messages.forEach((message, index) =>
            setTimeout(
              () =>
                bot
                  .sendMessage(chatId, message, { parse_mode: "HTML" })
                  .catch((error) => {
                    if (
                      error.response?.body?.description?.includes(
                        "bot was blocked by the user"
                      )
                    ) {
                      User.delete({ chatId })
                    }

                    return logger.error(
                      `Failed to send message to chat ${chatId}; ${error.response?.body?.description}`
                    )
                  }),
              5000 * index
            )
          )
        }, 5000 * index)
      )
    }
  })
}
