import userRoute from "./userRoute.js"

const allRoutes = ({ app, db }) => {
  userRoute({ app, db })
}

export default allRoutes
