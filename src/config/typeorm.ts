import { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from "@constants"
import { District, User } from "@entities"
import { createConnection } from "typeorm"

type TypeormConfig = Parameters<typeof createConnection>[0]

export const typeormConfig: TypeormConfig = {
  database: DATABASE_NAME as string,
  user: DATABASE_USER as string,
  password: DATABASE_PASSWORD as string,
  type: "postgres",
  logging: false,
  synchronize: true,
  entities: [User, District],
} as TypeormConfig
