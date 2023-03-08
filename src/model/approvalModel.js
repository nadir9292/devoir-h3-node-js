import { Model } from "objection"

class ApprovalModel extends Model {
  static tableName = "approval"

  static findApprovalByIdApprovalAndState(idApproval, state) {
    return ApprovalModel.query().find({ idApproval, state })
  }
}

export default ApprovalModel
