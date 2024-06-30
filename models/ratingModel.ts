import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  score: Number,
  type: String,
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});
const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;
