import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profilePic: {
      type: String,
    },
    teamLeader: {
      type: String,
    },
    teamMembers: {
      type: [String],
    },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    ratings: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
    judge: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge" }],
  },
  {
    timestamps: true,
  }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
