import { Model } from "objection"
import hashPassword from "../method/hashPassword.js"

class UserModel extends Model {
  static tableName = "user"

  checkPassword(password) {
    const [passwordHash] = hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }

  static findUserByMail(mail) {
    return UserModel.query().findOne({ mail })
  }

  static findUserByRole(role) {
    return UserModel.query().findOne({ role })
  }

  static findUserById(id) {
    return UserModel.query().findOne({ id })
  }

  static findUserByIdAndRole(id, role) {
    return UserModel.query().findOne({ id, role })
  }
}

export default UserModel
