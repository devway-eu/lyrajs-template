import bcrypt from "bcrypt"

import { User } from "@entity/User"
import { userRepository } from "@repository/UserRepository"

export class AppFixtures {
  private users = [
    {
      username: "Mithrandil",
      firstname: "Gandalf",
      lastname: "Thewhite",
      email: "gandalf@mail.com",
      password: "Y0u$ha11n0tpa$$!"
    },
    {
      username: "Pippin",
      firstname: "Peregrin",
      lastname: "Took",
      email: "pippin@mail.com",
      password: "Mu$hr0000m$!!"
    },
    {
      username: "Merry",
      firstname: "Meriadoc",
      lastname: "Brandybuck",
      email: "merry@mail.com",
      password: "Mu$hr0000m$!!"
    }
  ]

  load = async () => {
    await this.loadUsers()
  }

  private loadUsers = async () => {
    for (const u of this.users) {
      const hashedPassword = await bcrypt.hash(u.password, 10)
      const user = new User()
      user.username = u.username
      user.firstname = u.firstname
      user.lastname = u.lastname
      user.email = u.email
      user.password = hashedPassword
      user.created_at = new Date()
      user.updated_at = new Date()
      await userRepository.save(user)
    }
  }
}
