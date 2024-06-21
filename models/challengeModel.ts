import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema({
  name: String,
  description: String,
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});
const Challenge = mongoose.model("Challenge", ChallengeSchema);
export default Challenge;
