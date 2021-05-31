import { District } from "@entities"
import { handleNotification } from "@messages"
import { getSlotsForDistrict } from "@requests"
import TelegramBot from "node-telegram-bot-api"

export const checkSlots = (bot: TelegramBot) =>
  District.find({
    relations: ["users"],
  })
    .then((districts) =>
      districts.filter(({ users }) => users?.length && users.length > 0)
    )
    .then((districts) =>
      districts.forEach(({ id, users }, index) =>
        setTimeout(
          () =>
            getSlotsForDistrict(id)
              .then((slots) =>
                slots.filter(
                  (slot) =>
                    slot.available_capacity > 0 ||
                    slot.available_capacity_dose1 > 0 ||
                    slot.available_capacity_dose2 > 0
                )
              )
              .then(
                (slots) =>
                  slots?.length &&
                  slots.length > 0 &&
                  users?.forEach(({ chatId }) =>
                    handleNotification(bot, chatId, slots)
                  )
              ),
          10000 * index
        )
      )
    )
