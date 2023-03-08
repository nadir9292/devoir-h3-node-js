import mockupRoute from "./mockupRoute.js"
import userRoute from "./userRoute.js"

const allRoutes = ({ app, db }) => {
  userRoute({ app, db })
  mockupRoute({ app, db })
}

export default allRoutes
