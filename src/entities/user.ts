import { BaseEntity, Entity, ManyToMany, PrimaryColumn } from "typeorm"
import { District } from "./district"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: "int" })
  chatId!: number

  @ManyToMany(() => District, (dist) => dist.users)
  districts?: District[]
}
