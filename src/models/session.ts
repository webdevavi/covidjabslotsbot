export interface ISession {
  session_id: string
  date: string
  available_capacity_dose1: number
  available_capacity_dose2: number
  min_age_limit: number
  vaccine: string
  slots: string[]
}

export class Session implements ISession {
  session_id: string
  date: string
  available_capacity_dose1: number
  available_capacity_dose2: number
  min_age_limit: number
  vaccine: string
  slots: string[]

  constructor({
    session_id,
    date,
    available_capacity_dose1,
    available_capacity_dose2,
    min_age_limit,
    vaccine,
    slots,
  }: ISession) {
    this.session_id = session_id
    this.date = date
    this.available_capacity_dose1 = available_capacity_dose1
    this.available_capacity_dose2 = available_capacity_dose2
    this.min_age_limit = min_age_limit
    this.vaccine = vaccine
    this.slots = slots
  }

  get message() {
    return `\u{1F195} <strong>Date: ${this.date}</strong> \u{1F195}

<strong>[${this.vaccine}]</strong>  <strong>[Age ${
      this.min_age_limit
    }+]</strong> 
      
Capacity: Dose 1 \- <strong>${
      this.available_capacity_dose1
    } Slots</strong> | Dose 2 \- <strong>${
      this.available_capacity_dose2
    } Slots</strong>

Slots: ${this.slots.join(" | ")}
`
  }
}
