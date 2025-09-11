import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelName: { type: String },
  description: { type: String },
  image: { type: String },
  joinedon: { type: Date, default: Date.now },
  location: {
    latitude: Number,
    longitude: Number
  }
});

export default mongoose.model("User", userSchema);
