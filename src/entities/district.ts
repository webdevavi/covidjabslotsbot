import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm"
import { User } from "./user"

@Entity()
export class District extends BaseEntity {
  @PrimaryColumn({ type: "int" })
  id!: number

  @Column()
  name!: string

  @ManyToMany(() => User, (user) => user.districts)
  @JoinTable()
  users?: User[]
}
