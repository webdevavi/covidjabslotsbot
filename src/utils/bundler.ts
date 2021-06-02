import { User } from "@entities"
import { Center, Token } from "@models"
import isBefore from "date-fns/isBefore"
import { chunkify } from "./chunkify"

export const bundleMessages = async (
  chatId: number,
  centers: Center[]
): Promise<string[]> => {
  const messages: string[] = []

  // getting the user from db with its id
  const user = await User.findOne(chatId)

  // if user doesn't exist, returns empty list of messages
  if (!user) return []

  // filter the notified sessions which are not expired
  const notifiedSessions = (
    JSON.parse(user.notifiedSessions ?? "[]") as string[]
  ).filter((token) => {
    const { expiry } = new Token(token)
    return isBefore(new Date(), expiry)
  })

  // waiting till all centers are processed
  await Promise.all(
    centers.map(async (center) => {
      // filtering the sessions that needs to be notified about
      // i.e. if session id does not exist in the list of notified sessions
      const slotsToNotify = center.validSessions
        .filter(
          (session) =>
            !notifiedSessions
              ?.map((token) => new Token(token).payload)
              .includes(session.getHash(center.center_id))
        )
        .map((session) => session)

      // pushing the new session ids that are being notified now
      // to the list of notified sessions
      notifiedSessions.push(
        ...slotsToNotify.map(
          (session) =>
            Token.fromPayload(session.getHash(center.center_id)).token
        )
      )

      // pushing all the session messages to messages list
      return messages.push(
        ...center.getAllMessages(
          slotsToNotify.map((session) => session.session_id)
        )
      )
    })
  )

  // setting the new list of notified sessions to user
  user.notifiedSessions = JSON.stringify(notifiedSessions)

  // updating the user in db
  await user.save()

  // getting chunks of messages
  const chunks = chunkify(messages)

  // sending message to user for each chunk
  return chunks.map((messages) =>
    messages.join(
      "\n\n\u{2796}\u{2796}\u{2796}  \u{2796}\u{2796}\u{2796}  \u{2796}\u{2796}\u{2796}\n\n"
    )
  )
}
