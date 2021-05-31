import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm"
import { District } from "./district"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: "int" })
  chatId!: number

  @ManyToMany(() => District, (dist) => dist.users)
  districts?: District[]

  @Column({ nullable: true })
  notifiedSessions?: string
}
