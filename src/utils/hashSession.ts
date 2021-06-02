import { Session } from "@models"
import crypto from "crypto"

export const hashSession = (centerId: number, session: Session) => {
  const data =
    session.date.replace(/-/g, "").substring(0, 4) +
    session.date.replace(/-/g, "").substring(6) +
    session.vaccine +
    centerId +
    session.available_capacity_dose1 +
    session.available_capacity_dose2

  return crypto.createHash("md5").update(data).digest("base64")
}
