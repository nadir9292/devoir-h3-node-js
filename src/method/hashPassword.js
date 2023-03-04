import { pbkdf2Sync, randomBytes } from "crypto"
import "dotenv/config"

const hashPassword = (password, salt = randomBytes(32).toString("hex")) => [
  pbkdf2Sync(
    password,
    salt,
    Number(process.env.SECURITY_ITERATION),
    Number(process.env.SECURITY_NUMBERBYTES),
    process.env.SECURITY_FORMATHASH
  ).toString("hex"),
  salt,
]

export default hashPassword
