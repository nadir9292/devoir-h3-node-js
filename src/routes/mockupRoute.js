import auth from "../middlewares/auth.js"
import MockupModel from "../model/mockupModel.js"
import UserModel from "../model/userModel.js"
import ApprovalModel from "../model/approvalModel.js"

const mockupRoute = ({ app }) => {
  //GET request
  app.get("/mockups", async (req, res) => {
    const mockups = await MockupModel.query()
    res.send(mockups)
  })

  //POST request
  app.post("/:artistId/create-mockup", auth, async (req, res) => {
    try {
      const {
        params: { artistId },
        session: { artistId: sessionUserId },
        body: { name, title },
      } = req

      const checkArtist = await UserModel.findUserByIdAndRole(
        Number(artistId),
        0 // 0 = role =  artist
      )

      if (Number(artistId) != sessionUserId && !checkArtist) {
        return res.status(403).send({ error: "access denied !" })
      }

      const insertedMockup = await MockupModel.query().insertAndFetch({
        name,
        title,
        artist: Number(artistId),
        state: "waiting",
      })
      res.send(insertedMockup)
    } catch (err) {
      return res.status(401).send({ error: "" + err })
    }
  })

  app.post("/:managerId/mockup/approuve/:mockupId", auth, async (req, res) => {
    // 3, 5, 6, 7
    try {
      const {
        params: { managerId, mockupId },
        session: { managerId: sessionUserId },
        body: { is_approved, comments },
      } = req

      const checkManager = await UserModel.findUserByIdAndRole(
        Number(managerId),
        1 // 1 = role =  manager
      )
      if (Number(managerId) != sessionUserId && !checkManager) {
        return res.status(403).send({ error: "access denied !" })
      }

      const checkMochupExists = await MockupModel.findMockupByIdMockup(
        Number(mockupId)
      )

      if (!checkMochupExists) {
        return res
          .status(403)
          .send({ error: "Mockup with id: " + mockupId + " does not exist" })
      }
      const insertedApproval = await ApprovalModel.query().insertAndFetch({
        is_approved,
        comments,
        id_mockup: mockupId,
        id_manager: managerId,
      })
      res.send(insertedApproval)
    } catch (err) {
      return res.status(401).send({ error: "" + err })
    }
  })

  app.post("/:adminId/check/mockup/:mockupId/approval", async (req, res) => {
    const {
      params: { adminId, mockupId },
    } = req

    try {
      const checkAdmin = await UserModel.findUserByIdAndRole(adminId, 2) // role = 2 = "admin"

      if (!checkAdmin) {
        return res.status(403).send({ error: "forbidden" })
      }

      const checkMochupExists = await MockupModel.findMockupByIdMockup(
        Number(mockupId)
      )

      if (!checkMochupExists) {
        return res
          .status(403)
          .send({ error: "Mockup with id: " + mockupId + " does not exist" })
      }

      //add verification if mockup already accepted or refused !

      const countManager = await UserModel.query() //count all currently manager in the database
        .count("* as total_manager")
        .where("role", 1)
        .first()

      const countApproval = await ApprovalModel.query() //count all currently approval for the mockup with the id specified in the params in the database
        .count("* as total_approval")
        .where("id_mockup", Number(mockupId))
        .first()

      if (
        countManager.total_manager <= countApproval.total_approval ===
        false
      ) {
        return res.status(403).send({
          error:
            "Mockup with id: " +
            mockupId +
            " does not have enough approval to be evaluated",
        })
      }
      const average = await ApprovalModel.query().select(
        ApprovalModel.raw(`
      CASE 
        WHEN AVG(CASE WHEN is_approved THEN 1 ELSE 0 END) >= 0.5 
          THEN true 
          ELSE false 
      END AS approval_average
    `)
      )
      const user = await MockupModel.query().patchAndFetchById(
        Number(mockupId),
        {
          state: average[0].approval_average,
        }
      )
      if (average[0].approval_average) {
        await res.send("the mockup is now " + average[0].approval_average)
      } else {
        await res.send("the mockup is now " + average[0].approval_average)
      }
    } catch (err) {
      return res.status(401).send({ error: "" + err })
    }
  })
}

export default mockupRoute
