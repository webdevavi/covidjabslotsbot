import {
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_USER,
  PROD,
} from "@constants"
import { District, User } from "@entities"
import { createConnection } from "typeorm"

type TypeormConfig = Parameters<typeof createConnection>[0]

export const typeormConfig = (): TypeormConfig => {
  const commonProps = {
    type: "postgres",
    logging: true,
    synchronize: true,
    entities: [User, District],
  }

  if (PROD) {
    return {
      url: DATABASE_URL as string,
      ...commonProps,
    } as TypeormConfig
  } else {
    return {
      database: DATABASE_NAME as string,
      user: DATABASE_USER as string,
      password: DATABASE_PASSWORD as string,
      ...commonProps,
    } as TypeormConfig
  }
}
