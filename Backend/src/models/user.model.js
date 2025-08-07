import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
      index: true,
    },

    school: {
      type: String,
    },

    city: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    }, // Email verification status

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"], // Hierarchical roles
      default: "user",
    },
    permissions: {
      type: [String], // ['manage_gallery', 'manage_courses', etc.]
      default: [],
    },

    otp: {
      type: String,
      default: null,
    }, // OTP for email verification

    otpExpiresAt: {
      type: Date,
      default: null,
    }, // OTP expiration time

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
    // Add profile completion tracking
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// don't use arrow here becoz it don't have contaxt scope or it needs
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // console.error("Error while comparing passwords:", error);
    throw new Error("Error while comparing passwords");
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

export const User = mongoose.model("User", userSchema);