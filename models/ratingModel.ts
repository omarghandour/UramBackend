import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  score: Number,
  type: {
    type: String,
    enum: ["Stage1", "Stage2", "Stage3", "FinalStage"],
    default: "FinalStage",
  },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});
const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;
