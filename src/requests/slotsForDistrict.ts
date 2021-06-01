import axios from "axios"
import { format } from "date-fns"
import { Center, ICenter } from "@models"

export const getSlotsForDistrict = (districtId: number) => {
  const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${format(
    new Date(),
    "dd-MM-yyyy"
  )}`

  return axios
    .get<{ centers: ICenter[] }>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        Accept: "*/*",
      },
    })
    .then(({ data }) => data.centers.map((center) => new Center(center)))
    .catch((error) => {
      console.error(error)
      return [] as Center[]
    })
}
