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
            getSlotsForDistrict(id).then((centers) =>
              users?.forEach(({ chatId }) =>
                handleNotification(bot, chatId, centers)
              )
            ),
          10000 * index
        )
      )
    )
