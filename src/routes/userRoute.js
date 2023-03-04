import UserModel from "../model/userModel.js"
import hashPassword from "../method/hashPassword.js"
import config from "../../config.js"
import jsonwebtoken from "jsonwebtoken"
import auth from "../middlewares/auth.js"

const userRoute = ({ app }) => {
  //GET request
  app.get("/users", async (req, res) => {
    const users = await UserModel.query()
    res.send(users)
  })

  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    if (Number(userId) != sessionUserId) {
      return res.status(403).send({ error: "acces denied !" })
    }

    const user = await UserModel.query()
      .select("id", "pseudo", "mail", "role", "created_at")
      .findById(userId)
    res.send(user)
  })

  //POST request
  //CREATTE USER
  app.post("/:adminId/create-user", async (req, res) => {
    const {
      body: { mail, pseudo, password },
      params: { adminId },
      session: { userId: sessionUserId },
    } = req

    try {
      if (Number(adminId) != sessionUserId) {
        return res.status(403).send({ error: "acces denied !" })
      }

      const checkAdmin = await UserModel.findUserByIdAndRole(adminId, 2) // role = 2 = "admin"

      if (!checkAdmin) {
        return res.status(403).send({ error: "forbidden" })
      }

      const user = await UserModel.findUserByMail(mail)

      if (user) {
        return res.status(401).send({ error: "your email already exists !" })
      }

      const [passwordHash, passwordSalt] = hashPassword(password)

      const insertedUser = await UserModel.query().insertAndFetch({
        mail,
        pseudo,
        role: 1,
        passwordHash,
        passwordSalt,
      })

      res.send(insertedUser)
    } catch (err) {
      return res.status(401).send({ error: "Error : " + err })
    }
  })

  //REGISTER USER
  app.post("/register", async ({ body: { mail, pseudo, password } }, res) => {
    try {
      const user = await UserModel.findUserByMail(mail)

      if (user) {
        return res.status(401).send({ error: "This email already exists !" })
      }

      const [passwordHash, passwordSalt] = hashPassword(password)

      const insertedUser = await UserModel.query().insertAndFetch({
        mail,
        pseudo,
        role: 0,
        passwordHash,
        passwordSalt,
      })

      res.send(insertedUser)
    } catch (err) {
      return res.status(401).send({ error: "Error : " + err })
    }
  })

  //LOGIN
  app.post("/login", async ({ body: { mail, password } }, res) => {
    try {
      const user = await UserModel.findUserByMail(mail)
      if (!user) {
        return res.status(401).send({ error: "User not found" })
      }

      if (!user.checkPassword(password)) {
        return res.status(401).send({ error: "Bad password !" })
      }

      const userId = user.id

      const jwt = jsonwebtoken.sign(
        { payload: { userId: user.id } },
        config.security.session.secret,
        { expiresIn: config.security.session.expiresIn }
      )

      return res.send({ userId, jwt })
    } catch (err) {
      return res.status(500).send({ error: "Internal server error" })
    }
  })

  //DELETE USER
  app.delete("/users/:userId", async (req, res) => {
    try {
      const {
        params: { userId },
      } = req

      const user = UserModel.findUserById(Number(userId))

      if (!user) {
        res.status(403).send("User not found")
      }

      user.delete()

      return res.send()
    } catch (err) {
      return res.status(500).send({ error: "Internal server error : " + err })
    }
  })
}

export default userRoute
