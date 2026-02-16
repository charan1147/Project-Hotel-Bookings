import mongoose from "mongoose";
import bcrypt from "bcrypt"; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true},
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12); 
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", userSchema);
