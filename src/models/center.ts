import { ISession, Session } from "./session"

export interface ICenter {
  center_id: number
  name: string
  address: string
  state_name: string
  district_name: string
  block_name: string
  pincode: number
  fee_type: string
  vaccine_fees?: [
    {
      vaccine: string
      fee: string
    }
  ]
  sessions: ISession[]
}

export class Center implements ICenter {
  center_id: number
  name: string
  address: string
  state_name: string
  district_name: string
  block_name: string
  pincode: number
  fee_type: string
  vaccine_fees?: [
    {
      vaccine: string
      fee: string
    }
  ]
  sessions: Session[]

  constructor({
    center_id,
    name,
    address,
    state_name,
    district_name,
    block_name,
    pincode,
    fee_type,
    vaccine_fees,
    sessions,
  }: ICenter) {
    this.center_id = center_id
    this.name = name
    this.address = address
    this.state_name = state_name
    this.district_name = district_name
    this.block_name = block_name
    this.pincode = pincode
    this.fee_type = fee_type
    this.vaccine_fees = vaccine_fees
    this.sessions = sessions.map((session) => new Session(session))
  }

  get validSessions() {
    return this.sessions.filter(
      (session) =>
        session.available_capacity_dose1 > 2 ||
        session.available_capacity_dose2 > 2
    )
  }

  private getSessionChunks(sessionsToNotify: string[]) {
    const sessions = this.validSessions.filter((slot) =>
      sessionsToNotify.includes(slot.session_id)
    )

    const R = []
    for (let i = 0; i < sessions.length; i += 5)
      R.push(sessions.slice(i, i + 5))
    return R
  }

  private get fullAddress() {
    return [
      this.name,
      this.address,
      this.block_name,
      this.district_name,
      this.pincode,
      this.state_name,
    ].join(", ")
  }

  private get fees() {
    return `Fee: <strong>${this.fee_type}</strong> ${
      this.vaccine_fees?.length && this.vaccine_fees.length > 0
        ? `<strong>| ${this.vaccine_fees
            .map(({ fee, vaccine }) => `${vaccine} - ₹${fee}`)
            .join(" | ")}</strong>`
        : ``
    }`
  }

  getAllMessages = (sessionsToNotify: string[]) => {
    const address = this.fullAddress

    return this.validSessions
      .filter((session) => sessionsToNotify.includes(session.session_id))
      .map(
        (session) =>
          `${session.message}
${this.fees}
Center:  <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            address
          )}"><strong>${address}</strong></a>`
      )
  }

  get validSessionIds() {
    return this.validSessions.map(({ session_id }) => session_id)
  }
}
