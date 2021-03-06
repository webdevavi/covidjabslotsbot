import { createLogger, transports, format } from "winston"
const { combine, timestamp, label, printf } = format
import chalk from "chalk"
import utcToZonedTime from "date-fns-tz/utcToZonedTime"
import formatDate from "date-fns/format"

const customFormat = printf(
  ({ level, message, label, timestamp, durationMs }) => {
    return `${chalk.yellow(
      formatDate(
        utcToZonedTime(new Date(timestamp), "Asia/Kolkata"),
        "yyyy-MM-dd pp"
      )
    )} ${chalk.magenta(`[${label}]`)} ${chalk[
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
    new transports.Console({
      format: _customFormat,
    }),
  ],
})
