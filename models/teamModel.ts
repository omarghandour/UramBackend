import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
    },
    teamLeader: {
      type: String,
      required: true,
    },
    teamMembers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
