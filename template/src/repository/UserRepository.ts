import { Repository } from "@lyrajs/core"
import { User } from "@entity/User"

class UserRepository extends Repository<User> {
  constructor() {
    super(User)
  }
}

export const userRepository = new UserRepository()
