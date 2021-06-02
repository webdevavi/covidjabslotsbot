export const chunkify = <T>(array: T[], length = 4) => {
  const R = []
  for (let i = 0; i < array.length; i += length)
    R.push(array.slice(i, i + length))
  return R
}
