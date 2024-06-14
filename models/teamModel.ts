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
    profilePic: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    teamLeader: {
      type: String,
      required: true,
    },
    teamMembers: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
