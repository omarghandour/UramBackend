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
    challengeName: {
      type: String,
    },
    challengeType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
