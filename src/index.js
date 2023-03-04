import express from "express"
import knexfile from "../knexfile.js"
import { Model } from "objection"
import knex from "knex"
import allRoutes from "./routes/allRoutes.js"

const app = express()

app.use(express.json())
const db = knex(knexfile)
Model.knex(db)
const port = 3000

allRoutes({ app, db })

app.listen(port, () => {
  console.log("App listening on port" + port)
})
