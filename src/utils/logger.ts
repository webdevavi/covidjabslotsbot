import { createLogger, transports, format } from "winston"
const { combine, timestamp, label, printf } = format
import chalk from "chalk"

const customFormat = printf(
  ({ level, message, label, timestamp, durationMs }) => {
    return `${chalk.yellow(timestamp)} ${chalk.magenta(`[${label}]`)} ${chalk[
      level === "error" ? "red" : "cyan"
    ](`${level}: ${message}`)}${
      durationMs ? " " + chalk.bgCyan.black(` ${durationMs / 1000}s `) : ""
    }`
  }
)

const _customFormat = combine(
  label({ label: "app" }),
  timestamp(),
  customFormat
)

export const logger = createLogger({
  level: "info",
  format: _customFormat,
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: _customFormat,
    })
  )
}
