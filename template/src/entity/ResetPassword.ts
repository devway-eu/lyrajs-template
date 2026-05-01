import { Column, Entity, Table } from "@lyra-js/core"

import { User } from "@entity/User"
import { UserRepository } from "@repository/UserRepository"

@Table()
export class ResetPassword extends Entity<ResetPassword> {
  @Column({ type: "bigint", pk: true })
  id: number
  @Column({ type: "bigint", fk: true, references: "user.id", onDelete: "CASCADE", unique: true })
  user: number
  @Column({ type: "varchar", size: 255, unique: true })
  token: string
  @Column({ type: "timestamp" })
  requested_at: string | Date = new Date()
  @Column({ type: "timestamp" })
  expires_at: string | Date = new Date()

  constructor(resetpassword?: Partial<ResetPassword> | ResetPassword) {
    super(resetpassword)
  }

  async getUser(): Promise<User | null> {
    const userRepository = new UserRepository()
    return await userRepository.find(this.user)
  }
}
