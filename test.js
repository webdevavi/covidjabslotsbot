const crypto = require("crypto")

const date = "01-06-2021"
const vaccine = "COVAXIN"
const centerId = 700278
const slots1 = 100
const slots2 = 105

const fromTimestamp = (timestamp) => {
  const _timestamp = Number(timestamp)
  const datum = !Number.isNaN(_timestamp) ? _timestamp * 1000 : null
  return datum ? new Date(datum) : null
}

const toTimestamp = (strDate) => {
  var datum = Date.parse(strDate)
  return datum / 1000
}

const data =
  date.replace(/-/g, "").substring(0, 4) +
  date.replace(/-/g, "").substring(6) +
  vaccine +
  centerId +
  slots1 +
  slots2

const data2 =
  date.replace(/-/g, "").substring(0, 4) +
  date.replace(/-/g, "").substring(6) +
  vaccine +
  centerId +
  108 +
  slots2

const hash = crypto.createHash("md5").update(data).digest("base64")
const hash2 = crypto.createHash("md5").update(data2).digest("base64")

const addTime = (str) =>
  `${str}:${toTimestamp(
    "Tue Jun 01 2021 23:02:22 GMT+0530 (India Standard Time)"
  )}`

const sessId = "08793a36-8727-457b-99b0-28d46c8996e8"

console.table({
  data: { text: data, length: data.length },
  "data with timeStamp": { text: addTime(data), length: addTime(data).length },
  hash: { text: hash, length: hash.length },
  "hash with timestamp": { text: addTime(hash), length: addTime(hash).length },
  "session id": {
    text: sessId,
    length: sessId.length,
  },
  "session id with timestamp": {
    text: addTime(sessId),
    length: addTime(sessId).length,
  },
  equality: hash === hash,
})
