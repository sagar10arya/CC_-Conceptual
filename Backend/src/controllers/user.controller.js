import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = asyncHandler(async (req, res) => {
  // get user details from the frontend
  // validation - not empty
  // Check if user already exists -> email, username
  // create user object - create entry in db
  // remove password and refresh tokens field from the response
  // check for user creation
  // return response

  /* get user details from the frontend  */
  const { fullName, email, username, password, school, city } = req.body;
  // console.log(req.body)
  // console.log("username: ", username)

  /*   get user details from the frontend */
  if (
    [fullName, email, username, password, school, city].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  /* Check if user already exists -> email, username */
  const existedUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: { $regex: `^${username}$`, $options: "i" } },
    ],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.");
  }

  // Generate OTP
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  /* create user object - create entry in db */
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    school,
    city,
    username: username.toLowerCase(),
    isVerified: false,
    otp,
    otpExpiresAt,
  });

  if (!user?.email && !req.body?.email) {
    throw new Error("Recipient email is missing in the request.");
  }

  // Send OTP via email
  await sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="text-align: center; padding: 20px; border-bottom: 2px solid #007BFF;">
        <h2 style="margin: 0; color: #007BFF;">Conceptual Classes</h2>
        <p style="margin: 0; font-size: 16px;">A Family of Learning</p>
      </div>
      <div style="text-align: center; padding: 20px;">
        <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737711603/logo_ou6lvy.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-bottom: 10px;">Your OTP is:</h3>
        <h1 style="color: #007BFF; font-size: 32px; margin: 0;"><strong>${otp}</strong></h1>
        <p style="margin-top: 10px; font-size: 14px;">This OTP is valid for 10 minutes.</p>
      </div>
      <div style="text-align: center; padding: 20px; border-top: 2px solid #007BFF;">
        <p style="margin: 0; font-size: 14px;">Follow us:</p>
        <a href="https://www.youtube.com/conceptualclasses2624" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827404/330685-P9SESK-66_ic2wxg.jpg" alt="YouTube" style="width: 40px;">
        </a>
        <a href="https://www.instagram.com/conceptual_classes_" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827175/10922266_inadra.png" alt="Instagram" style="width: 40px;">
        </a>
      </div>
    </div>
  </body>
</html>
 `,
    text: `Your OTP is: ${otp}. This OTP is valid for 10 minutes.`,
  });

  /* remove password and refresh tokens field from the response */
  // .select -> we give which field we don't want to select as all our selected by default
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  /* check for user creation */
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  /* return response*/
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registerd Successfully."));
});

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying email." });
  }
};

// Resend OTP
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate new OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="text-align: center; padding: 20px; border-bottom: 2px solid #007BFF;">
        <h2 style="margin: 0; color: #007BFF;">Conceptual Classes</h2>
        <p style="margin: 0; font-size: 16px;">A Family of Learning</p>
      </div>
      <div style="text-align: center; padding: 20px;">
        <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737711603/logo_ou6lvy.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-bottom: 10px;">Your OTP is:</h3>
        <h1 style="color: #007BFF; font-size: 32px; margin: 0;"><strong>${otp}</strong></h1>
        <p style="margin-top: 10px; font-size: 14px;">This OTP is valid for 10 minutes.</p>
      </div>
      <div style="text-align: center; padding: 20px; border-top: 2px solid #007BFF;">
        <p style="margin: 0; font-size: 14px;">Follow us:</p>
        <a href="https://www.youtube.com/conceptualclasses2624" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827404/330685-P9SESK-66_ic2wxg.jpg" alt="YouTube" style="width: 40px;">
        </a>
        <a href="https://www.instagram.com/conceptual_classes_" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827175/10922266_inadra.png" alt="Instagram" style="width: 40px;">
        </a>
      </div>
    </div>
  </body>
</html>
 `,
      text: `Your OTP is: ${otp}. This OTP is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP." });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data -> username or email
  // find the user
  // password check
  // access and refresh tokens
  // send cookies

  // req body -> data -> username or email
  const { username, email, password } = req.body;
  // console.log(email);

  if (!(username || email)) {
    throw new ApiError(404, "username or email is required.");
  }

  // find the user
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    // console.log("User does not exist");
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          null,
          "User does not exist. Please create an account."
        )
      );
  }

  // password check
  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    console.log("Password mismatch:", {
      storedPassword: user.password,
      inputPassword: password,
    });
    throw new ApiError(404, "Invaid User Credentials.");
  }

  // Check if email is verified
  if (!user.isVerified) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Your email is not verified. Please verify your email to log in."
        )
      );
  }

  // access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // console.log("Backend User :: ", req.user, req.user._id)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from the document
      },
    },
    { new: true }
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction, // Use HTTPS only in production
    sameSite: isProduction ? "strict" : "lax", // Adjust based on your needs
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  // console.log("Incoming Refresh Token:", incomingRefreshToken);

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random OTP and its expiration time
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Update the user with the OTP and expiration time
    user.otp = otp;
    user.otpExpiresAt = new Date(otpExpiresAt);
    await user.save();

    // Send the OTP to the user's email
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="text-align: center; padding: 20px; border-bottom: 2px solid #007BFF;">
        <h2 style="margin: 0; color: #007BFF;">Conceptual Classes</h2>
        <p style="margin: 0; font-size: 16px;">A Family of Learning</p>
      </div>
      <div style="text-align: center; padding: 20px;">
        <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737711603/logo_ou6lvy.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-bottom: 10px;">Your OTP is:</h3>
        <h1 style="color: #007BFF; font-size: 32px; margin: 0;"><strong>${otp}</strong></h1>
        <p style="margin-top: 10px; font-size: 14px;">This OTP is valid for 10 minutes.</p>
      </div>
      <div style="text-align: center; padding: 20px; border-top: 2px solid #007BFF;">
        <p style="margin: 0; font-size: 14px;">Follow us:</p>
        <a href="https://www.youtube.com/conceptualclasses2624" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827404/330685-P9SESK-66_ic2wxg.jpg" alt="YouTube" style="width: 40px;">
        </a>
        <a href="https://www.instagram.com/conceptual_classes_" target="_blank" style="margin: 0 10px;">
          <img src="https://res.cloudinary.com/dnt7nxs7f/image/upload/v1737827175/10922266_inadra.png" alt="Instagram" style="width: 40px;">
        </a>
      </div>
    </div>
  </body>
</html>
`,
      text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate request body
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user and validate OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpiresAt: { $gt: new Date() }, // Ensure OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user de tails
    user.password = newPassword;
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null; // Clear expiration time

    await user.save();


    // Respond with success
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    // Log error for debugging
    console.error("Error resetting password:", error);

    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
