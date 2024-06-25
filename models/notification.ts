import mongoose from "mongoose";

const notification = new mongoose.Schema({
  name: String,
  description: String,
});
const Notification = mongoose.model("Notification", notification);
export default Notification;
