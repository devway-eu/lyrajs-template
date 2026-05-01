import { Repository } from "@lyra-js/core"

import { ResetPassword } from "@entity/ResetPassword"

export class ResetPasswordRepository extends Repository<ResetPassword> {
  constructor() {
    super(ResetPassword)
  }
}
