export interface ISession {
  center_id: number
  name: string
  address: string
  state_name: string
  district_name: string
  block_name: string
  pincode: number
  from: string
  to: string
  lat: number
  long: number
  fee_type: string
  session_id: string
  date: string
  available_capacity_dose1: number
  available_capacity_dose2: number
  available_capacity: number
  fee: string
  min_age_limit: number
  vaccine: string
  slots: string[]
}

export class Session implements ISession {
  center_id: number
  name: string
  address: string
  state_name: string
  district_name: string
  block_name: string
  pincode: number
  from: string
  to: string
  lat: number
  long: number
  fee_type: string
  session_id: string
  date: string
  available_capacity_dose1: number
  available_capacity_dose2: number
  available_capacity: number
  fee: string
  min_age_limit: number
  vaccine: string
  slots: string[]

  constructor({
    center_id,
    name,
    address,
    state_name,
    district_name,
    block_name,
    pincode,
    from,
    to,
    lat,
    long,
    fee_type,
    session_id,
    date,
    available_capacity_dose1,
    available_capacity_dose2,
    available_capacity,
    fee,
    min_age_limit,
    vaccine,
    slots,
  }: ISession) {
    this.center_id = center_id
    this.name = name
    this.address = address
    this.state_name = state_name
    this.district_name = district_name
    this.block_name = block_name
    this.pincode = pincode
    this.from = from
    this.to = to
    this.lat = lat
    this.long = long
    this.fee_type = fee_type
    this.session_id = session_id
    this.date = date
    this.available_capacity_dose1 = available_capacity_dose1
    this.available_capacity_dose2 = available_capacity_dose2
    this.available_capacity = available_capacity
    this.fee = fee
    this.min_age_limit = min_age_limit
    this.vaccine = vaccine
    this.slots = slots
  }
}
