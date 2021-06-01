import { District } from "@entities"
import { handleNotification } from "@messages"
import { getSlotsForDistrict } from "@requests"
import { logger, sleep } from "@utils"
import TelegramBot from "node-telegram-bot-api"

export const checkSlots = async (bot: TelegramBot) => {
  const districts = await District.find({ relations: ["users"] }).then(
    (districts) =>
      districts.filter(({ users }) => users?.length && users.length > 0)
  )

  return await Promise.all(
    districts.map(async ({ id, users }, index) => {
      await sleep(1000 * 5 * index) // wait for 5 seconds
      logger.profile(`Checked slots for district ${id}`)

      logger.log("info", `Checking slots for district ${id}`)

      const sessions = await getSlotsForDistrict(id).then((slots) =>
        slots.filter(
          (slot) =>
            slot.available_capacity_dose1 > 0 ||
            slot.available_capacity_dose2 > 0
        )
      )

      logger.profile(`Checked slots for district ${id}`)

      if (sessions.length > 0) {
        users?.forEach(async ({ chatId }, index) => {
          await sleep(1000 * index) // wait for 1 second
          handleNotification(bot, chatId, sessions)
        })
      }

      return
    })
  )
}
