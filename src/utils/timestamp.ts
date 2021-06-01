export const fromTimestamp = (timestamp: string) => {
  const _timestamp = Number(timestamp)
  const datum = !Number.isNaN(_timestamp) ? _timestamp * 1000 : null
  return datum ? new Date(datum) : null
}

export const toTimestamp = (strDate: string) => {
  var datum = Date.parse(strDate)
  return datum / 1000
}
