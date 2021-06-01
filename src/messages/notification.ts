import { User } from "@entities"
import { Session } from "@models"
import { fromTimestamp, toTimestamp } from "@utils"
import { add, isBefore } from "date-fns"
import TelegramBot from "node-telegram-bot-api"

const getChunks = <T>(array: T[], chunkSize: number) => {
  var R = []
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize))
  return R
}

export const handleNotification = async (
  bot: TelegramBot,
  chatId: number,
  slots: Session[]
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

      const slotsToNotify = slots
        .map(({ session_id }) => session_id)
        .filter(
          (session) =>
            !notifiedSessions
              ?.map(
                (sessionWithTimestamp) => sessionWithTimestamp.split(":")?.[0]
              )
              .includes(session)
        )

      notifiedSessions = [
        ...notifiedSessions,
        ...slotsToNotify.map(
          (session) =>
            `${session}:${toTimestamp(add(new Date(), { days: 1 }).toString())}`
        ),
      ]

      user.notifiedSessions = JSON.stringify(notifiedSessions)

      await user.save()

      const slotChunks = getChunks(
        slots.filter((slot) => slotsToNotify.includes(slot.session_id)),
        5
      )

      slotChunks.forEach((slots) => {
        const message = slots
          .map((slot) => {
            const address = [
              slot.name,
              slot.address,
              slot.block_name,
              slot.district_name,
              slot.pincode,
              slot.state_name,
            ].join(", ")
            return `\u{1F195} <strong>Date: ${slot.date}</strong> \u{1F195}

<strong>[${slot.vaccine}]</strong>  <strong>[Age ${
              slot.min_age_limit
            }+]</strong>  <strong>[${
              slot.fee_type === "Free" ? "FREE" : `₹${slot.fee}`
            }]</strong>
      
Capacity: Dose 1 \- <strong>${
              slot.available_capacity_dose1
            } Slots</strong> | Dose 2 \- <strong>${
              slot.available_capacity_dose2
            } Slots</strong>
      
Address:  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}"><strong>${address}</strong></a>`
          })
          .join(
            "\n\n\u{2796}\u{2796}\u{2796}  \u{2796}\u{2796}\u{2796}  \u{2796}\u{2796}\u{2796}\n\n"
          )

        return bot.sendMessage(chatId, message, { parse_mode: "HTML" })
      })
    }
  })
}
