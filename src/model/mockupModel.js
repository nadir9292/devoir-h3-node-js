import { Model } from "objection"

class MockupModel extends Model {
  static tableName = "mockup"

  static findMockupByIdMockup(id) {
    return MockupModel.query().findOne({ id })
  }

  static findMockupByArtist(artistName) {
    return MockupModel.query().findOne({ artist: artistName })
  }
}

export default MockupModel
