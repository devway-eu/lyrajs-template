import { Container } from "@lyra-js/core"

import { User } from "@entity/User"

export class AppFixtures extends Container {
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
      const hashedPassword = await this.bcrypt.hash(u.password, 10)
      const user = new User()
      user.username = u.username
      user.firstname = u.firstname
      user.lastname = u.lastname
      user.email = u.email
      user.password = hashedPassword
      user.created_at = new Date()
      user.updated_at = new Date()
      await this.userRepository.save(user)
    }
  }
}
