import { fromTimestamp, toTimestamp } from "@utils"
import add from "date-fns/add"

export class Token {
  token: string

  constructor(token: string) {
    this.token = token
  }

  static fromPayload(payload: string, hours = 8): Token {
    return new Token(
      `${payload}:${toTimestamp(add(new Date(), { hours }).toString())}`
    )
  }

  get expiry(): Date {
    return fromTimestamp(this.token?.split(":")?.[1] ?? "") ?? new Date()
  }

  get payload(): string {
    return this.token?.split(":")?.[0]
  }
}
