import UserModel from "../model/userModel.js"
import hashPassword from "../method/hashPassword.js"
import config from "../../config.js"
import jsonwebtoken from "jsonwebtoken"
import auth from "../middlewares/auth.js"

const userRoute = ({ app }) => {
  //GET request
  app.get("/users", async (req, res) => {
    const users = await UserModel.query().select(
      "id",
      "pseudo",
      "mail",
      "role",
      "created_at"
    )
    res.send(users)
  })

  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    if (Number(userId) != sessionUserId) {
      return res.status(403).send({ error: "access denied !" })
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
      body: { mail, pseudo, password, role },
      params: { adminId },
    } = req

    try {
      const checkAdmin = await UserModel.findUserByIdAndRole(adminId, 2) // role = 2 = "admin"

      if (!checkAdmin) {
        return res.status(403).send({ error: "forbidden" })
      }

      const user = await UserModel.findUserByMail(mail)

      if (user) {
        return res.status(401).send({ error: "your email already exists !" })
      }

      const [passwordHash, passwordSalt] = hashPassword(password)

      await UserModel.query().insertAndFetch({
        mail,
        pseudo,
        role,
        passwordHash,
        passwordSalt,
      })

      res.send("User created successfully")
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

      await UserModel.query().insertAndFetch({
        mail,
        pseudo,
        role: 0,
        passwordHash,
        passwordSalt,
      })

      res.status(200).send("User created successfully")
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

  app.post("/users/:adminId/ban/:userId", async (req, res) => {
    try {
      const {
        params: { adminId, userId },
      } = req

      const checkAdmin = await UserModel.findUserByIdAndRole(Number(adminId), 2) // role = 2 = "admin"

      if (!checkAdmin) {
        return res.status(403).send({ error: "forbidden" })
      }

      const user = await UserModel.query().patchAndFetchById(Number(userId), {
        isBanned: true,
      })
      res.status(200).send("User (id: " + Number(userId) + ") has been banned")
    } catch (err) {
      return res.status(500).send("error: " + err)
    }
  })

  //DELETE USER
  app.delete("/:adminId/users/:userId", async (req, res) => {
    try {
      const {
        params: { userId, adminId },
      } = req

      const checkAdmin = await UserModel.findUserByIdAndRole(adminId, 2) // role = 2 = "admin"

      if (!checkAdmin) {
        return res.status(403).send({ error: "forbidden" })
      }

      const user = await UserModel.query().deleteById(Number(userId))

      if (!user) {
        res.status(403).send("User not found")
      }

      return res.send()
    } catch (err) {
      return res.status(500).send({ error: "Internal server error : " + err })
    }
  })
}

export default userRoute
